namespace $ {

	/** Splits CSV text to rows of cells */
	export function $bog_molefy_csv_rows( text: string ) {
		const source = text.replace( /^﻿/, '' )
		const head = source.split( /\r?\n/, 1 )[0]
		const mark = [ ',', ';', '\t' ].sort( ( a, b )=> head.split( b ).length - head.split( a ).length )[0]
		const rows = [] as string[][]
		let row = [] as string[]
		let cell = ''
		let quoted = false
		for( let i = 0; i < source.length; ++ i ) {
			const char = source[i]
			if( quoted ) {
				if( char !== '"' ) cell += char
				else if( source[ i + 1 ] === '"' ) cell += source[ ++ i ]
				else quoted = false
			}
			else if( char === '"' && !cell ) quoted = true
			else if( char === mark ) { row.push( cell ); cell = '' }
			else if( char === '\n' ) { row.push( cell ); rows.push( row ); row = []; cell = '' }
			else if( char !== '\r' ) cell += char
		}
		if( cell || row.length ) { row.push( cell ); rows.push( row ) }
		return rows.filter( row => row.some( cell => cell.trim() ) )
	}

	export function $bog_molefy_csv_text( rows: readonly ( readonly string[] )[] ) {
		const cell = ( text: string )=> /[",\r\n]|^\s|\s$/.test( text ) ? '"' + text.replace( /"/g, '""' ) + '"' : text
		return '﻿' + rows.map( row => row.map( cell ).join( ',' ) ).join( '\r\n' ) + '\r\n'
	}

	function dates( texts: readonly string[] ) {
		const parts = texts.map( text => text.trim().split( /[\s T]/ )[0].split( /[.\/-]/ ).map( Number ) )
		const month_first = texts.some( text => text.includes( '/' ) ) && parts.some( p => p[0] <= 12 && p[1] > 12 )
		return parts.map( ([ a, b, c ], index )=> {
			const [ year, month, day ] = a > 31 ? [ a, b, c ] : month_first ? [ c, a, b ] : [ c, b, a ]
			const full = year < 100 ? year + 2000 : year
			if( !full || !( month >= 1 && month <= 12 ) || !( day >= 1 && day <= 31 ) ) $mol_fail( new Error( 'Непонятная дата: ' + texts[ index ] ) )
			return [ full, month, day ].map( ( num, pos )=> String( num ).padStart( pos ? 2 : 4, '0' ) ).join( '-' )
		} )
	}

	/** Reads exported table of operations */
	export function $bog_molefy_csv_dump( text: string ): $bog_molefy_dump {

		const [ head, ... rows ] = $bog_molefy_csv_rows( text )
		const titles = ( head ?? [] ).map( cell => cell.trim().toLowerCase() )
		const seat = ( name: string )=> titles.indexOf( name )
		const [ date, account, category, amount, currency ] = [ 'date', 'account', 'category', 'amount', 'currency' ].map( seat )
		const note = seat( 'description' )
		if( [ date, account, category, amount ].some( index => index < 0 ) ) $mol_fail( new Error( 'В файле нет столбцов date, account, category, amount' ) )

		const days = dates( rows.map( row => row[ date ] ) )
		const accounts = new Map< string, $bog_molefy_dump_account >()
		const categories = new Map< string, $bog_molefy_dump_category >()
		const ops = [] as $bog_molefy_dump_op[]
		const gone = [] as $bog_molefy_dump_op[]
		const come = [] as $bog_molefy_dump_op[]
		const outs = new Set( rows.filter( row => $bog_molefy_cents( row[ amount ] ) < 0 ).map( row => row[ category ].trim() ) )

		rows.forEach( ( row, index )=> {

			const name = row[ account ].trim()
			const title = row[ category ].trim()
			const sum = $bog_molefy_cents( row[ amount ] )
			const day = days[ index ]
			const text = ( row[ note ] ?? '' ).trim()

			if( !accounts.has( name ) ) accounts.set( name, { name, cur: row[ currency ]?.trim() || 'RUB', init: 0, total: true, off: false, icon: '' } )

			if( title === 'InitialBalance' ) {
				accounts.get( name )!.init += sum
				return
			}

			const base = { day, time: '', note: text, category: '', kind: 'out' as const }
			if( title === 'ExpenseTransfer' ) return gone.push({ ... base, account: name, to: '', sum: Math.abs( sum ) })
			if( title === 'IncomeTransfer' ) return come.push({ ... base, account: '', to: name, sum: Math.abs( sum ) })

			const kind = sum < 0 || !sum && outs.has( title ) ? 'out' : 'in'
			categories.set( kind + title, { name: title, kind, icon: '', off: false } )
			ops.push({ ... base, account: name, category: title, kind, sum })

		} )

		for( const loss of gone ) {
			const same = ( op: $bog_molefy_dump_op )=> op.day === loss.day && op.note === loss.note && op.to !== loss.account
			const cur = ( name: string )=> accounts.get( name )!.cur
			let index = come.findIndex( op => same( op ) && op.sum === loss.sum )
			if( index < 0 ) index = come.findIndex( op => same( op ) && cur( op.to! ) !== cur( loss.account ) )
			const [ gain ] = index < 0 ? [] : come.splice( index, 1 )
			ops.push( gain ? { ... loss, to: gain.to, ... gain.sum === loss.sum ? {} : { got: gain.sum } } : loss )
		}

		return { accounts: [ ... accounts.values() ], categories: [ ... categories.values() ], ops: [ ... ops, ... come ] }
	}

	/** Makes table of operations in the same layout */
	export function $bog_molefy_csv_export( book: $bog_molefy_book ) {

		const rows = [ [ 'date', 'account', 'category', 'amount', 'currency', 'converted amount', 'currency', 'description' ] ]

		const add = ( day: string, id: string, category: string, cents: number, note: string )=> {
			const account = book.accounts().get( id )
			if( !account ) return
			rows.push([
				day.split( '-' ).reverse().join( '.' ),
				account.name,
				category,
				String( cents / 100 ),
				account.cur,
				String( book.convert( cents, account.cur ) / 100 ),
				book.currency(),
				note,
			])
		}

		const ops = [ ... book.ops_between([ '0000-01-01', '9999-12-31' ]) ].reverse()
		const first = ops[0]?.[1].day ?? $bog_molefy_today()
		for( const [ id, account ] of book.accounts() ) if( account.init ) add( first, id, 'InitialBalance', account.init, '' )

		for( const [ , op ] of ops ) {
			if( op.to === undefined ) {
				add( op.day, op.account, book.categories().get( op.category )?.name ?? '', op.sum, op.note )
				continue
			}
			add( op.day, op.account, 'ExpenseTransfer', - op.sum, op.note )
			add( op.day, op.to, 'IncomeTransfer', op.got ?? op.sum, op.note )
		}

		return $bog_molefy_csv_text( rows )
	}

}
