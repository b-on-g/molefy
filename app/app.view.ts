namespace $.$$ {

	export class $bog_molefy_app extends $.$bog_molefy_app {

		auto() {
			this.own_store()
			this.store()
			if( this.ready() && this.Book().repeats_due().length ) this.repeats_start()
		}

		@ $mol_mem
		repeats_start() {
			return new this.$.$mol_after_tick( ()=> $mol_wire_async( this.Book() ).repeats_run() )
		}

		arg( key: string, next?: string | null ) {
			return this.$.$mol_state_arg.value( key, next ) ?? ''
		}

		mode( next?: 'own' | null ) {
			return this.$.$mol_state_local.value( 'bog_molefy_mode', next ) ?? null
		}

		grant( next?: $bog_id_login_grant | null ) {
			return this.$.$mol_state_local.value( 'bog_molefy_grant', next ) ?? null
		}

		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_molefy_home )
		}

		own_store() {
			const link = this.home().Land()?.val()
			return link ? this.$.$giper_baza_glob.Land( new $giper_baza_link( link ) ).Data( $bog_molefy_store ) : null
		}

		store() {
			const grant = this.grant()
			if( grant ) return this.$.$bog_id_land( grant.pointer )?.Data( $bog_molefy_store ) ?? null
			return this.mode() === 'own' ? this.own_store() : null
		}

		ready() {
			return Boolean( this.store() )
		}

		own_enter( key?: string ) {
			if( key === undefined ) return null
			if( key === 'make' ) this.own_make()
			else this.own_switch( key )
			return null
		}

		own_make() {
			if( !this.own_store() ) {
				const land = this.$.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])
				const book = $bog_molefy_book.make({ store: ()=> land.Data( $bog_molefy_store ) })
				book.seed()
				this.home().Land( 'auto' )!.val( land.link().str )
			}
			this.mode( 'own' )
		}

		own_switch( key: string ) {
			this.mode( 'own' )
			this.$.$giper_baza_auth.current( $giper_baza_auth.from( key ) )
			this.$.$mol_dom_context.location.reload()
		}

		@ $mol_action
		leave() {
			this.grant( null )
			this.mode( null )
			this.close()
		}

		account_key() {
			if( this.grant() ) return ''
			const auth = this.$.$giper_baza_auth.current()
			return auth.toString() + auth.toStringPrivate()
		}

		account_lord() {
			const grant = this.grant()
			return grant ? `Гипер ID: ${ grant.name || grant.lord }` : `Свой ключ: ${ this.$.$giper_baza_auth.current().pass().lord().str }`
		}

		merge_rows() {
			const offer = this.grant() && this.ready()
				&& !this.$.$mol_state_local.value( 'bog_molefy_merged' )
				&& !this.Own_book().empty()
			return offer ? [ this.Merge_text(), this.Merge_run(), this.Merge_skip() ] : []
		}

		merge() {
			$mol_wire_async( this ).merge_run()
		}

		merge_run() {
			this.Book().copy_from( this.Own_book() )
			this.$.$mol_state_local.value( 'bog_molefy_merged', true )
		}

		merge_skip() {
			this.$.$mol_state_local.value( 'bog_molefy_merged', true )
		}

		pages() {
			if( !this.grant() && !this.mode() ) return [ this.Login() ]
			if( !this.ready() ) return [ this.Wait() ]
			return [ this.Main(), ... this.details() ]
		}

		main_body() {
			return this.Book().empty() ? [ this.Seed() ] : [ this.Period_bar(), this.Ring(), ... this.budget_text() ? [ this.Budget() ] : [] ]
		}

		seed() {
			return $mol_wire_async( this.Book() ).seed()
		}

		details() {
			const open = this.arg( 'open' )
			if( open === 'menu' ) return [ this.Shade(), this.Menu() ]
			if( open === 'settings' ) return [ this.Shade(), this.Settings() ]
			if( open === 'search' ) return [ this.Search() ]
			if( open === 'feed' ) return [ this.Feed() ]
			if( open === 'entry' ) return [ this.Entry([ this.arg( 'kind' ), this.arg( 'op' ), this.arg( 'category' ) ].join( ':' )) ]
			return []
		}

		@ $mol_action
		close() {
			this.$.$mol_state_arg.dict( this.target( '' ) )
		}

		target( open: string, kind = '', op = '', category = '' ) {
			return {
				... this.$.$mol_state_arg.dict(),
				open: open || null,
				kind: kind || null,
				op: op || null,
				category: category || null,
			}
		}

		menu_arg() {
			return this.target( 'menu' )
		}

		account_title() {
			return this.account_name( this.account() )
		}

		settings_arg() {
			return this.target( 'settings' )
		}

		search_arg() {
			return this.target( 'search' )
		}

		feed_arg() {
			return this.target( 'feed' )
		}

		minus_arg() {
			return this.target( 'entry', 'out' )
		}

		plus_arg() {
			return this.target( 'entry', 'in' )
		}

		transfer_arg() {
			return this.target( 'entry', 'transfer' )
		}

		account() {
			return this.arg( 'account' )
		}

		currency() {
			return this.Book().accounts().get( this.account() )?.cur ?? this.Book().currency()
		}

		money( cents: number ) {
			return $bog_molefy_money( cents, this.currency() )
		}

		period( next?: string ) {
			const period = this.arg( 'period', next ) || 'month'
			if( next && next !== 'range' ) this.close()
			return period
		}

		day( next?: string ) {
			return this.arg( 'day', next ) || $bog_molefy_today()
		}

		range_from( next?: string ) {
			return this.arg( 'from', next ) || $bog_molefy_range( 'month', this.day() )[0]
		}

		range_till( next?: string ) {
			return this.arg( 'till', next ) || $bog_molefy_range( 'month', this.day() )[1]
		}

		range_fields() {
			return this.period() === 'range' ? [ this.Range_from(), this.Range_till() ] : []
		}

		@ $mol_mem
		range(): [ string, string ] {
			if( this.period() === 'range' ) return [ this.range_from(), this.range_till() ]
			return $bog_molefy_range( this.period() as $bog_molefy_period, this.day() )
		}

		move( count: number ) {
			const period = this.period()
			if( period === 'all' || period === 'range' ) return
			this.day( $bog_molefy_shift( this.day(), period, count ) )
		}

		@ $mol_action
		prev() {
			this.move( -1 )
		}

		@ $mol_action
		next() {
			this.move( 1 )
		}

		@ $mol_mem
		period_title() {
			const [ from, till ] = this.range()
			const text = ( day: string, mask: string )=> new $mol_time_moment( day ).toString( mask, 'ru' )
			const period = this.period()
			if( period === 'all' ) return 'Всё время'
			if( period === 'day' ) return text( from, 'D Month YYYY' )
			if( period === 'month' ) return text( from, 'Month YYYY' )
			if( period === 'year' ) return from.slice( 0, 4 )
			return text( from, 'DD.MM.YY' ) + ' – ' + text( till, 'DD.MM.YY' )
		}

		@ $mol_mem
		ops() {
			return this.Book().ops_between( this.range() ).filter( ([ , op ])=> this.Book().op_accounts( op ).some( id => this.Book().visible( id, this.account() ) ) )
		}

		op_value( op: $bog_molefy_op ) {
			const cur = this.Book().accounts().get( op.account )?.cur ?? this.currency()
			return this.account() ? op.sum : this.Book().convert( op.sum, cur )
		}

		@ $mol_mem
		category_sums() {
			const sums = new Map< string, number >()
			for( const [ , op ] of this.ops() ) {
				if( op.to === undefined ) sums.set( op.category, ( sums.get( op.category ) ?? 0 ) + this.op_value( op ) )
			}
			return sums
		}

		@ $mol_mem
		parts() {
			const sums = this.category_sums()
			return [ ... this.Book().categories() ]
				.filter( ([ id, row ])=> row.kind === 'out' && ( !row.off || sums.has( id ) ) )
				.map( ([ id, row ])=> ({ id, name: row.name, icon: row.icon, sum: - ( sums.get( id ) ?? 0 ) }) )
		}

		kind_sum( kind: $bog_molefy_kind ) {
			let sum = 0
			for( const [ id, value ] of this.category_sums() ) {
				if( ( this.Book().categories().get( id )?.kind ?? 'out' ) === kind ) sum += value
			}
			return sum
		}

		income_text() {
			return this.money( this.kind_sum( 'in' ) )
		}

		expense_text() {
			return this.money( - this.kind_sum( 'out' ) )
		}

		carry() {
			return this.Book().setting( 'carry' ) === 'yes'
		}

		@ $mol_mem
		period_balance() {
			const [ from, till ] = this.range()
			const book = this.Book()
			if( this.carry() || this.period() === 'all' ) return book.balance([ this.account(), till ])
			return book.ops_between([ from, till ]).reduce( ( sum, [ , op ] )=> sum + book.op_effect( op, this.account() ), 0 )
		}

		balance_minus() {
			return this.period_balance() < 0
		}

		balance_text() {
			return 'Баланс ' + this.money( this.period_balance() )
		}

		@ $mol_mem
		budget_text() {
			const budget = $bog_molefy_cents( this.Book().setting( 'budget' ) )
			if( !budget || this.period() !== 'month' || this.account() ) return ''
			const rest = budget + this.kind_sum( 'out' )
			return rest >= 0 ? `Осталось из бюджета ${ this.money( rest ) }` : `Бюджет превышен на ${ this.money( - rest ) }`
		}

		part_pick( id?: string ) {
			if( id ) this.$.$mol_state_arg.dict( this.target( 'entry', 'out', '', id ) )
			return ''
		}

		account_links() {
			return [ '', ... [ ... this.Book().accounts() ].filter( ([ , row ])=> !row.off ).map( ([ id ])=> id ) ].map( id => this.Account( id ) )
		}

		account_arg( id: string ) {
			return { ... this.target( '' ), account: id || null }
		}

		account_icon( id: string ) {
			return id ? this.Book().accounts().get( id )?.icon ?? '' : 'wallet'
		}

		account_name( id: string ) {
			return id ? this.Book().accounts().get( id )?.name ?? '' : super.account_name( id )
		}

		account_balance( id: string ) {
			const cur = this.Book().accounts().get( id )?.cur ?? this.Book().currency()
			return $bog_molefy_money( this.Book().balance([ id, '9999-12-31' ]), cur )
		}

		@ $mol_mem
		groups() {
			const groups = new Map< string, string[] >()
			for( const [ id, op ] of this.ops() ) {
				const key = op.to === undefined ? op.category : 'transfer'
				groups.set( key, [ ... groups.get( key ) ?? [], id ] )
			}
			return groups
		}

		group_rows() {
			const size = ( id: string )=> Math.abs( this.category_sums().get( id ) ?? 0 )
			return [ ... this.groups().keys() ].sort( ( a, b )=> size( b ) - size( a ) ).map( id => this.Group( id ) )
		}

		group_title( id: string ) {
			if( id === 'transfer' ) return `Переводы (${ this.groups().get( id )?.length ?? 0 })`
			return `${ this.Book().categories().get( id )?.name ?? 'Без категории' } ${ this.money( this.category_sums().get( id ) ?? 0 ) }`
		}

		group_ops( id: string ) {
			return ( this.groups().get( id ) ?? [] ).map( op => this.Op( op ) )
		}

		@ $mol_mem
		op_index() {
			return new Map( this.Book().ops_between([ '0000-01-01', '9999-12-31' ]) )
		}

		op_kind( op: $bog_molefy_op ) {
			return op.to !== undefined ? 'transfer' : this.Book().categories().get( op.category )?.kind ?? ( op.sum < 0 ? 'out' : 'in' )
		}

		op_arg( id: string ) {
			const op = this.op_index().get( id )
			return this.target( 'entry', op ? this.op_kind( op ) : '', id )
		}

		op_icon( id: string ) {
			const op = this.op_index().get( id )
			return op?.to !== undefined ? 'transfer' : this.Book().categories().get( op?.category ?? '' )?.icon ?? 'tag'
		}

		op_name( op: $bog_molefy_op ) {
			const name = ( id: string )=> this.Book().accounts().get( id )?.name ?? 'удалённый счёт'
			return op.to !== undefined ? `${ name( op.account ) } → ${ name( op.to ) }` : this.Book().categories().get( op.category )?.name ?? ''
		}

		op_title( id: string ) {
			const op = this.op_index().get( id )
			if( !op ) return ''
			return [ op.day.split( '-' ).reverse().join( '.' ), this.op_name( op ), op.note ].filter( Boolean ).join( ', ' )
		}

		op_sum( id: string ) {
			const op = this.op_index().get( id )
			if( !op ) return ''
			const account = this.Book().accounts().get( op.account || op.to! )
			return $bog_molefy_money( op.sum, account?.cur ?? '' )
		}

		@ $mol_mem
		found_rows() {
			const query = this.query().trim()
			if( !query ) return []
			const match = $mol_match_text( query, ( [ , op ]: [ string, $bog_molefy_op ] )=> [ op.note, this.op_name( op ), String( Math.abs( op.sum ) / 100 ) ] )
			return [ ... this.op_index() ].filter( match ).map( ([ id ])=> this.Op( id ) )
		}

		entry_kind( key: string ) {
			return key.split( ':' )[0] || 'out'
		}

		entry_id( key: string ) {
			return key.split( ':' )[1]
		}

		entry_category( key: string ) {
			return key.split( ':' )[2]
		}

	}

}
