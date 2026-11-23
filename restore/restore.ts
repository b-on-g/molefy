namespace $ {

	export type $bog_molefy_dump_account = Omit< $bog_molefy_account, 'pos' >
	export type $bog_molefy_dump_category = Omit< $bog_molefy_category, 'pos' >
	export type $bog_molefy_dump_op = $bog_molefy_op & { kind: $bog_molefy_kind }

	export type $bog_molefy_dump = {
		accounts: $bog_molefy_dump_account[]
		categories: $bog_molefy_dump_category[]
		ops: $bog_molefy_dump_op[]
	}

	export type $bog_molefy_restore_report = { added: number, same: number, dropped: number }

	export function $bog_molefy_restore_parse( bin: Uint8Array< ArrayBuffer > ) {
		const magic = new TextDecoder().decode( bin.subarray( 0, 6 ) )
		return magic === 'SQLite' ? $bog_molefy_sqlite_dump( bin ) : $bog_molefy_csv_dump( new TextDecoder().decode( bin ) )
	}

	/** Writes dump to book, repeated run changes nothing */
	export function $bog_molefy_restore( book: $bog_molefy_book, dump: $bog_molefy_dump, replace: boolean ): $bog_molefy_restore_report {

		const months = book.months().map( month => [ month, new Map( book.month_ops( month ) ) ] as const )
		const accounts = new Map( book.accounts() )
		const categories = new Map( book.categories() )
		const account_names = new Map( [ ... accounts ].map( ([ id, row ])=> [ row.name.trim(), id ] ) )
		const category_names = new Map( [ ... categories ].map( ([ id, row ])=> [ row.kind + row.name.trim(), id ] ) )

		const sign = ( op: $bog_molefy_op )=> JSON.stringify([ op.day, op.account, op.category, op.sum, op.note, op.to ?? null, op.got ?? null ])

		dump.accounts.forEach( ( row, pos )=> {
			const id = account_names.get( row.name )
			const old = id ? accounts.get( id )! : null
			if( old && !replace ) return
			const next = { ... row, icon: row.icon || old?.icon || $bog_molefy_icon_guess( row.name, 'card' ), pos: old?.pos ?? accounts.size + pos }
			const key = id ?? $mol_guid()
			account_names.set( row.name, key )
			book.account_put( key, next )
		} )

		dump.categories.forEach( ( row, pos )=> {
			const id = category_names.get( row.kind + row.name )
			const old = id ? categories.get( id )! : null
			if( old && !replace ) return
			const next = { ... row, icon: row.icon || old?.icon || $bog_molefy_icon_guess( row.name, 'tag' ), pos: old?.pos ?? categories.size + pos }
			const key = id ?? $mol_guid()
			category_names.set( row.kind + row.name, key )
			book.category_put( key, next )
		} )

		const stock = new Map< string, [ string, string ][] >()
		for( const [ month, ops ] of months ) {
			for( const [ id, op ] of ops ) {
				const key = sign( op )
				stock.set( key, [ ... stock.get( key ) ?? [], [ id, month ] ] )
			}
		}

		const report = { added: 0, same: 0, dropped: 0 }

		for( const { kind, ... row } of dump.ops ) {
			const op = {
				... row,
				account: account_names.get( row.account ) ?? '',
				category: row.category ? category_names.get( kind + row.category )! : '',
				... row.to === undefined ? {} : { to: account_names.get( row.to ) ?? '' },
			}
			if( stock.get( sign( op ) )?.shift() ) {
				++ report.same
				continue
			}
			book.op_put( $mol_guid(), op )
			++ report.added
		}

		if( !replace ) return report

		for( const rest of stock.values() ) {
			for( const [ id, month ] of rest ) {
				book.op_drop( id, month )
				++ report.dropped
			}
		}

		const keep_accounts = new Set( dump.accounts.map( row => account_names.get( row.name ) ) )
		const keep_categories = new Set( dump.categories.map( row => category_names.get( row.kind + row.name ) ) )
		for( const id of accounts.keys() ) if( !keep_accounts.has( id ) ) book.store()!.Accounts( 'auto' )!.has( id, false )
		for( const id of categories.keys() ) if( !keep_categories.has( id ) ) book.store()!.Categories( 'auto' )!.has( id, false )
		for( const id of [ ... book.repeats().keys() ] ) book.repeat_drop( id )

		return report
	}

}
