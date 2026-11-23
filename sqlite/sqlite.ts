namespace $ {

	export type $bog_molefy_sqlite_row = Record< string, string | number | bigint | null | Uint8Array >

	/** Read only access to tables of SQLite file */
	export class $bog_molefy_sqlite extends Object {

		readonly view: DataView
		readonly size: number
		readonly usable: number

		constructor( readonly bin: Uint8Array< ArrayBuffer > ) {
			super()
			const magic = new TextDecoder().decode( bin.subarray( 0, 15 ) )
			if( magic !== 'SQLite format 3' ) $mol_fail( new Error( 'Это не база SQLite' ) )
			this.view = new DataView( bin.buffer, bin.byteOffset, bin.byteLength )
			this.size = this.view.getUint16( 16 ) === 1 ? 65536 : this.view.getUint16( 16 )
			this.usable = this.size - bin[ 20 ]
		}

		varint( pos: number ): [ number, number ] {
			let value = 0n
			for( let i = 0; i < 8; ++ i ) {
				const byte = this.bin[ pos + i ]
				value = value << 7n | BigInt( byte & 127 )
				if( byte < 128 ) return [ Number( value ), pos + i + 1 ]
			}
			return [ Number( BigInt.asIntN( 64, value << 8n | BigInt( this.bin[ pos + 8 ] ) ) ), pos + 9 ]
		}

		payload( pos: number, size: number ) {
			const max = this.usable - 35
			if( size <= max ) return this.bin.slice( pos, pos + size )
			const min = Math.floor( ( this.usable - 12 ) * 32 / 255 ) - 23
			const tail = min + ( size - min ) % ( this.usable - 4 )
			const local = tail <= max ? tail : min
			const all = new Uint8Array( size )
			all.set( this.bin.subarray( pos, pos + local ) )
			let page = this.view.getUint32( pos + local )
			for( let done = local; done < size && page; ) {
				const base = ( page - 1 ) * this.size
				const part = Math.min( size - done, this.usable - 4 )
				all.set( this.bin.subarray( base + 4, base + 4 + part ), done )
				done += part
				page = this.view.getUint32( base )
			}
			return all
		}

		record( bin: Uint8Array< ArrayBuffer > ) {
			const view = new DataView( bin.buffer, bin.byteOffset, bin.byteLength )
			const varint = ( pos: number ): [ number, number ]=> {
				let value = 0
				while( bin[ pos ] >= 128 ) value = value * 128 + ( bin[ pos ++ ] & 127 )
				return [ value * 128 + bin[ pos ], pos + 1 ]
			}
			let [ end, head ] = varint( 0 )
			let pos = end
			const values = [] as $bog_molefy_sqlite_row[ string ][]
			while( head < end ) {
				let type: number
				;[ type, head ] = varint( head )
				if( type === 0 ) values.push( null )
				else if( type === 8 || type === 9 ) values.push( type - 8 )
				else if( type === 7 ) { values.push( view.getFloat64( pos ) ); pos += 8 }
				else if( type < 7 ) {
					const length = [ 0, 1, 2, 3, 4, 6, 8 ][ type ]
					let value = BigInt( view.getInt8( pos ) )
					for( let i = 1; i < length; ++ i ) value = value << 8n | BigInt( bin[ pos + i ] )
					values.push( Number.isSafeInteger( Number( value ) ) ? Number( value ) : value )
					pos += length
				}
				else {
					const length = ( type - ( type % 2 ? 13 : 12 ) ) / 2
					const part = bin.slice( pos, pos + length )
					values.push( type % 2 ? new TextDecoder().decode( part ) : part )
					pos += length
				}
			}
			return values
		}

		*cells( page: number ): Generator< [ number, $bog_molefy_sqlite_row[ string ][] ] > {
			const base = ( page - 1 ) * this.size
			const head = base + ( page === 1 ? 100 : 0 )
			const type = this.bin[ head ]
			const count = this.view.getUint16( head + 3 )
			const inner = type === 5
			if( !inner && type !== 13 ) $mol_fail( new Error( 'База повреждена' ) )
			for( let i = 0; i < count; ++ i ) {
				const cell = base + this.view.getUint16( head + ( inner ? 12 : 8 ) + i * 2 )
				if( inner ) {
					yield* this.cells( this.view.getUint32( cell ) )
					continue
				}
				const [ size, after ] = this.varint( cell )
				const [ rowid, start ] = this.varint( after )
				yield [ rowid, this.record( this.payload( start, size ) ) ]
			}
			if( inner ) yield* this.cells( this.view.getUint32( head + 8 ) )
		}

		table( name: string ) {
			for( const [ , [ type, title, , root, sql ] ] of this.cells( 1 ) ) {
				if( type !== 'table' || title !== name ) continue
				const text = String( sql )
				const columns = text.slice( text.indexOf( '(' ) + 1, text.lastIndexOf( ')' ) ).split( ',' ).map( column => ({
					name: column.match( /\w+/ )![0],
					rowid: /\binteger\s+primary\s+key/i.test( column ),
				}) )
				return [ ... this.cells( Number( root ) ) ].map( ([ rowid, values ])=> {
					const row = {} as $bog_molefy_sqlite_row
					columns.forEach( ( column, index )=> row[ column.name ] = column.rowid ? rowid : values[ index ] ?? null )
					return row
				} )
			}
			return $mol_fail( new Error( 'В базе нет таблицы ' + name ) )
		}

	}

	function moment( ticks: $bog_molefy_sqlite_row[ string ] ) {
		const iso = new Date( Number( BigInt( ticks as number | bigint ) / 10000n ) - 62135596800000 ).toISOString()
		return { day: iso.slice( 0, 10 ), time: iso.slice( 11, 16 ) }
	}

	/** Reads backup database */
	export function $bog_molefy_sqlite_dump( bin: Uint8Array< ArrayBuffer > ): $bog_molefy_dump {

		const base = new $bog_molefy_sqlite( bin )
		const live = ( name: string )=> base.table( name ).filter( row => !row.DeletedOn )
		const text = ( value: $bog_molefy_sqlite_row[ string ] )=> String( value ?? '' ).trim()
		const cents = ( value: $bog_molefy_sqlite_row[ string ] )=> Math.round( Number( value ) / 10 )

		const currencies = new Map( base.table( 'Currency' ).map( row => [ row.Id, text( row.AlphabeticCode ) ] ) )
		const accounts = new Map( live( 'Account' ).map( row => [ row.Id, {
			name: text( row.Name ),
			cur: currencies.get( row.CurrencyId ) || 'RUB',
			init: cents( row.InitialBalanceCents ),
			total: Boolean( row.IsIncludedInTotalBalance ),
			off: Boolean( row.DisabledOn ),
			icon: '',
		} ] ) )
		const categories = new Map( live( 'Category' ).map( row => [ row.Id, {
			name: text( row.Name ),
			kind: ( row.CategoryType ? 'out' : 'in' ) as $bog_molefy_kind,
			icon: $bog_molefy_icon_legacy( Number( row.Icon ) ),
			off: Boolean( row.DisabledOn ),
		} ] ) )

		const ops = [] as $bog_molefy_dump_op[]

		for( const row of live( 'Transaction' ) ) {
			const account = accounts.get( row.AccountId )
			const category = categories.get( row.CategoryId )
			if( !account || !category ) continue
			const sum = Math.abs( cents( row.AmountCents ) )
			ops.push({
				... moment( row.CreatedOn ),
				account: account.name,
				category: category.name,
				kind: category.kind,
				sum: category.kind === 'out' ? - sum : sum,
				note: text( row.Note ),
			})
		}

		for( const row of live( 'Transfer' ) ) {
			const from = accounts.get( row.AccountFromId )
			const to = accounts.get( row.AccountToId )
			if( !from && !to ) continue
			ops.push({
				... moment( row.CreatedOn ),
				account: from?.name ?? '',
				to: to?.name ?? '',
				category: '',
				kind: 'out',
				sum: Math.abs( cents( row.AmountCents ) ),
				note: text( row.Note ),
			})
		}

		return { accounts: [ ... accounts.values() ], categories: [ ... categories.values() ], ops }
	}

}
