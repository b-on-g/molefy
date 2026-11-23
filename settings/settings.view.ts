namespace $.$$ {

	export class $bog_molefy_settings extends $.$bog_molefy_settings {

		currency( next?: string ) {
			return this.book().currency( next?.trim().toUpperCase() )
		}

		rate_rows() {
			const all = [ ... this.book().accounts().values() ].map( row => row.cur )
			return [ ... new Set( all ) ].filter( cur => cur !== this.book().currency() ).map( cur => this.Rate( cur ) )
		}

		rate_title( cur: string ) {
			return `1 ${ cur } в ${ this.book().currency() }`
		}

		rate( cur: string, next?: string ) {
			return this.book().rate( cur, next )
		}

		budget( next?: string ) {
			return this.book().setting( 'budget', next )
		}

		carry( next?: boolean ) {
			return this.book().setting( 'carry', next === undefined ? undefined : next ? 'yes' : 'no' ) === 'yes'
		}

		icon_names() {
			return $bog_molefy_icon_names
		}

		account( id: string, next?: Partial< $bog_molefy_account > ) {
			const row = this.book().accounts().get( id )!
			if( next ) this.book().account_put( id, { ... row, ... next } )
			return next ? { ... row, ... next } : row
		}

		account_rows() {
			return [ ... [ ... this.book().accounts().keys() ].map( id => this.Account( id ) ), this.Account_add() ]
		}

		account_name( id: string, next?: string ) {
			return this.account( id, next === undefined ? undefined : { name: next } ).name
		}

		account_cur( id: string, next?: string ) {
			return this.account( id, next === undefined ? undefined : { cur: next.trim().toUpperCase() } ).cur
		}

		@ $mol_mem_key
		account_init( id: string, next?: string ) {
			if( next === undefined ) return String( this.account( id ).init / 100 )
			this.account( id, { init: $bog_molefy_cents( next ) } )
			return next
		}

		account_icon( id: string, next?: string ) {
			return this.account( id, next === undefined ? undefined : { icon: next } ).icon
		}

		account_total( id: string, next?: boolean ) {
			return this.account( id, next === undefined ? undefined : { total: next } ).total
		}

		account_off( id: string, next?: boolean ) {
			return this.account( id, next === undefined ? undefined : { off: next } ).off
		}

		@ $mol_action
		account_add() {
			const book = this.book()
			book.account_put( $mol_guid(), { name: 'Новый счёт', icon: 'card', cur: book.currency(), init: 0, total: true, off: false, pos: book.accounts().size } )
		}

		category( id: string, next?: Partial< $bog_molefy_category > ) {
			const row = this.book().categories().get( id )!
			if( next ) this.book().category_put( id, { ... row, ... next } )
			return next ? { ... row, ... next } : row
		}

		category_rows() {
			return [ ... [ ... this.book().categories().keys() ].map( id => this.Category( id ) ), this.Category_add_out(), this.Category_add_in() ]
		}

		category_name( id: string, next?: string ) {
			return this.category( id, next === undefined ? undefined : { name: next } ).name
		}

		category_icon( id: string, next?: string ) {
			return this.category( id, next === undefined ? undefined : { icon: next } ).icon
		}

		category_off( id: string, next?: boolean ) {
			return this.category( id, next === undefined ? undefined : { off: next } ).off
		}

		category_make( kind: $bog_molefy_kind ) {
			const book = this.book()
			book.category_put( $mol_guid(), { name: 'Новая категория', kind, icon: 'tag', off: false, pos: book.categories().size } )
		}

		@ $mol_action
		category_add_out() {
			this.category_make( 'out' )
		}

		@ $mol_action
		category_add_in() {
			this.category_make( 'in' )
		}

		repeat_rows() {
			return [ ... this.book().repeats().keys() ].map( id => this.Repeat( id ) )
		}

		repeat_title( id: string ) {
			const row = this.book().repeats().get( id )!
			const book = this.book()
			const cur = book.accounts().get( row.op.account )?.cur ?? ''
			const name = book.categories().get( row.op.category )?.name ?? 'Перевод'
			return `${ name }, ${ $bog_molefy_money( row.op.sum, cur ) }, следующий ${ row.next }`
		}

		@ $mol_action
		repeat_drop( id: string ) {
			this.book().repeat_drop( id )
		}

		@ $mol_mem
		dump() {
			const file = this.files().at( -1 )
			if( !file ) return null
			return $bog_molefy_restore_parse( new Uint8Array( $mol_wire_sync( file ).arrayBuffer() ) )
		}

		found() {
			const dump = this.dump()
			return dump ? `Операций: ${ dump.ops.length }, счетов: ${ dump.accounts.length }, категорий: ${ dump.categories.length }` : ''
		}

		restore_rows() {
			return [
				this.Open(),
				... this.files().length ? [ this.Found(), this.Append(), this.Replace() ] : [],
				this.Restore_status(),
			]
		}

		restore_append() {
			$mol_wire_async( this ).restore( false )
		}

		restore_replace() {
			if( !this.$.$mol_dom_context.confirm( 'Операции, счета и категории, которых нет в файле, удалятся. Заменить?' ) ) return
			$mol_wire_async( this ).restore( true )
		}

		restore( replace: boolean ) {
			const dump = this.dump()
			if( !dump ) return
			const report = $bog_molefy_restore( this.book(), dump, replace )
			this.files([])
			this.restore_status( `Добавлено: ${ report.added }, уже было: ${ report.same }, удалено: ${ report.dropped }` )
		}

		export() {
			const text = $bog_molefy_csv_export( this.book() )
			const doc = this.$.$mol_dom_context.document
			const link = doc.createElement( 'a' )
			link.href = URL.createObjectURL( new Blob( [ text ], { type: 'text/csv' } ) )
			link.download = `molefy-${ $bog_molefy_today() }.csv`
			link.click()
		}

		key_rows() {
			return this.account_key()
				? [ this.Lord(), this.Key_hint(), this.Qr(), this.Leave() ]
				: [ this.Lord(), this.Leave() ]
		}

	}

}
