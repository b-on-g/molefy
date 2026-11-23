namespace $ {

	type Table = InstanceType< ReturnType< typeof $giper_baza_dict_to< typeof $giper_baza_atom_text > > >

	export class $bog_molefy_book extends $mol_object {

		store(): $bog_molefy_store | null {
			return null
		}

		rows< Row >( table: Table | null | undefined ) {
			const rows = new Map< string, Row >()
			for( const key of table?.keys() ?? [] ) {
				const text = table!.key( key )?.val()
				if( text ) rows.set( String( key ), JSON.parse( text ) )
			}
			return rows
		}

		put( table: Table, id: string, row: unknown ) {
			table.key( id, 'auto' ).val( JSON.stringify( row ) )
		}

		@ $mol_mem
		accounts() {
			const rows = this.rows< $bog_molefy_account >( this.store()?.Accounts() )
			return new Map( [ ... rows ].sort( ( a, b )=> a[1].pos - b[1].pos || ( a[0] < b[0] ? -1 : 1 ) ) )
		}

		@ $mol_mem
		categories() {
			const rows = this.rows< $bog_molefy_category >( this.store()?.Categories() )
			return new Map( [ ... rows ].sort( ( a, b )=> a[1].pos - b[1].pos || ( a[0] < b[0] ? -1 : 1 ) ) )
		}

		@ $mol_mem
		repeats() {
			return this.rows< $bog_molefy_repeat >( this.store()?.Repeats() )
		}

		@ $mol_mem
		months() {
			return ( this.store()?.Ops()?.keys() ?? [] ).map( String ).sort()
		}

		@ $mol_mem_key
		month_ops( month: string ) {
			return this.rows< $bog_molefy_op >( this.store()?.Ops()?.key( month ) )
		}

		setting( key: string, next?: string ) {
			return this.store()?.Settings( next )?.key( key, next )?.val( next ) ?? ''
		}

		currency( next?: string ) {
			return this.setting( 'currency', next ) || 'RUB'
		}

		rate( cur: string, next?: string ) {
			return this.store()?.Rates( next )?.key( cur, next )?.val( next ) ?? ''
		}

		convert( cents: number, cur: string ) {
			if( cur === this.currency() ) return cents
			return Math.round( cents * ( Number( this.rate( cur ).replace( ',', '.' ) ) || 1 ) )
		}

		account_put( id: string, row: $bog_molefy_account ) {
			this.put( this.store()!.Accounts( 'auto' )!, id, row )
		}

		category_put( id: string, row: $bog_molefy_category ) {
			this.put( this.store()!.Categories( 'auto' )!, id, row )
		}

		repeat_put( id: string, row: $bog_molefy_repeat ) {
			this.put( this.store()!.Repeats( 'auto' )!, id, row )
		}

		repeat_drop( id: string ) {
			this.store()!.Repeats( 'auto' )!.has( id, false )
		}

		op_put( id: string, row: $bog_molefy_op ) {
			const months = this.store()!.Ops( 'auto' )!
			this.put( months.key( row.day.slice( 0, 7 ), 'auto' ), id, row )
		}

		op_drop( id: string, month: string ) {
			this.store()!.Ops()?.key( month )?.has( id, false )
		}

		op_find( id: string ) {
			for( const month of this.months() ) {
				const op = this.month_ops( month ).get( id )
				if( op ) return op
			}
			return null
		}

		op_accounts( op: $bog_molefy_op ) {
			return op.to === undefined ? [ op.account ] : [ op.account, op.to ].filter( Boolean )
		}

		visible( account: string, only: string ) {
			if( only ) return account === only
			return this.accounts().get( account )?.total ?? false
		}

		op_effect( op: $bog_molefy_op, only = '' ) {
			const part = ( account: string, cents: number )=> {
				if( !this.visible( account, only ) ) return 0
				const cur = this.accounts().get( account )!.cur
				return only ? cents : this.convert( cents, cur )
			}
			if( op.to === undefined ) return part( op.account, op.sum )
			return part( op.account, - op.sum ) + part( op.to, op.got ?? op.sum )
		}

		@ $mol_mem_key
		ops_between( [ from, till ]: [ string, string ] ) {
			const found = [] as [ string, $bog_molefy_op ][]
			for( const month of this.months() ) {
				if( month < from.slice( 0, 7 ) || month > till.slice( 0, 7 ) ) continue
				for( const pair of this.month_ops( month ) ) {
					if( pair[1].day >= from && pair[1].day <= till ) found.push( pair )
				}
			}
			const key = ( op: $bog_molefy_op )=> op.day + ' ' + op.time
			return found.sort( ( a, b )=> key( a[1] ) < key( b[1] ) ? 1 : key( a[1] ) > key( b[1] ) ? -1 : 0 )
		}

		@ $mol_mem_key
		month_effect( [ month, only ]: [ string, string ] ) {
			let sum = 0
			for( const op of this.month_ops( month ).values() ) sum += this.op_effect( op, only )
			return sum
		}

		@ $mol_mem_key
		balance( [ only, till ]: [ string, string ] ) {
			let sum = 0
			for( const [ id, account ] of this.accounts() ) {
				if( this.visible( id, only ) ) sum += only ? account.init : this.convert( account.init, account.cur )
			}
			for( const month of this.months() ) {
				if( month < till.slice( 0, 7 ) ) sum += this.month_effect([ month, only ])
				else if( month === till.slice( 0, 7 ) ) {
					for( const op of this.month_ops( month ).values() ) if( op.day <= till ) sum += this.op_effect( op, only )
				}
			}
			return sum
		}

		@ $mol_mem
		repeats_due() {
			const today = $bog_molefy_today()
			return [ ... this.repeats() ].filter( ([ , row ])=> row.next <= today )
		}

		repeats_run() {
			const today = $bog_molefy_today()
			for( const [ id, row ] of this.repeats_due() ) {
				let step = 0
				let day = row.op.day
				const forward = ()=> day = $bog_molefy_shift( row.op.day, row.every, ++ step )
				while( day < row.next ) forward()
				while( day <= today ) {
					this.op_put( id + '_' + day, { ... row.op, day } )
					forward()
				}
				this.repeat_put( id, { ... row, next: day } )
			}
		}

		empty() {
			return !this.accounts().size
		}

		seed() {
			if( !this.empty() ) return
			this.account_put( 'cash', { name: 'Наличные', icon: 'cash', cur: 'RUB', init: 0, total: true, off: false, pos: 0 } )
			this.account_put( 'card', { name: 'Карта', icon: 'card', cur: 'RUB', init: 0, total: true, off: false, pos: 1 } )
			const out = [
				[ 'Продукты', 'food' ], [ 'Дом', 'home' ], [ 'Кафе', 'cafe' ], [ 'Транспорт', 'bus' ], [ 'Такси', 'taxi' ], [ 'Машина', 'car' ],
				[ 'Здоровье', 'health' ], [ 'Гигиена', 'hygiene' ], [ 'Одежда', 'clothes' ], [ 'Связь', 'phone' ], [ 'Развлечения', 'fun' ], [ 'Спорт', 'sport' ],
				[ 'Подарки', 'gift' ], [ 'Питомцы', 'pet' ], [ 'Обучение', 'study' ], [ 'Счета', 'bill' ],
			]
			const income = [ [ 'Зарплата', 'cash' ], [ 'Сбережения', 'piggy' ], [ 'Депозиты', 'bank' ] ]
			out.forEach( ( [ name, icon ], pos )=> this.category_put( icon, { name, icon, kind: 'out', off: false, pos } ) )
			income.forEach( ( [ name, icon ], pos )=> this.category_put( 'in_' + icon, { name, icon, kind: 'in', off: false, pos } ) )
		}

		copy_from( source: $bog_molefy_book ) {
			for( const [ id, row ] of source.accounts() ) this.account_put( id, row )
			for( const [ id, row ] of source.categories() ) this.category_put( id, row )
			for( const [ id, row ] of source.repeats() ) this.repeat_put( id, row )
			for( const month of source.months() ) {
				for( const [ id, row ] of source.month_ops( month ) ) this.op_put( id, row )
			}
			for( const key of source.store()?.Settings()?.keys() ?? [] ) this.setting( String( key ), source.setting( String( key ) ) )
			for( const key of source.store()?.Rates()?.keys() ?? [] ) this.rate( String( key ), source.rate( String( key ) ) )
		}

	}

}
