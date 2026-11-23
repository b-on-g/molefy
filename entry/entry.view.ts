namespace $.$$ {

	const marks = [ '7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '.', '0', '=', '+' ]

	export class $bog_molefy_entry extends $.$bog_molefy_entry {

		op() {
			return this.id() ? this.book().op_find( this.id() ) : null
		}

		transfer() {
			return this.kind() === 'transfer'
		}

		head_title() {
			if( this.id() ) return this.title_edit()
			return this.transfer() ? this.title_transfer() : this.kind() === 'in' ? this.title_in() : this.title_out()
		}

		tools() {
			return this.id() ? [ this.Drop(), this.Close() ] : [ this.Close() ]
		}

		fields() {
			return [
				this.Day(),
				this.Accounts(),
				this.Amount_row(),
				... this.foreign() ? [ this.Got() ] : [],
				this.Note(),
				this.Keys(),
				... this.id() ? [] : [ this.Repeat() ],
				... this.transfer() ? [] : [ this.Hint(), this.Categories() ],
				... this.transfer() || this.category_current() ? [ this.Save() ] : [],
			]
		}

		account_fields() {
			return this.transfer() ? [ this.From(), this.Arrow(), this.To() ] : [ this.From() ]
		}

		@ $mol_mem
		account_names() {
			const used = [ this.op()?.account, this.op()?.to ]
			return Object.fromEntries( [ ... this.book().accounts() ]
				.filter( ([ id, row ])=> !row.off || used.includes( id ) )
				.map( ([ id, row ])=> [ id, row.name ] )
			)
		}

		@ $mol_mem
		day( next?: string ) {
			return next ?? this.op()?.day ?? $bog_molefy_today()
		}

		@ $mol_mem
		from( next?: string ) {
			return next ?? this.op()?.account ?? ( this.account() || Object.keys( this.account_names() )[0] || '' )
		}

		@ $mol_mem
		to( next?: string ) {
			return next ?? this.op()?.to ?? Object.keys( this.account_names() ).find( id => id !== this.from() ) ?? ''
		}

		@ $mol_mem
		text( next?: string ) {
			const op = this.op()
			return next ?? ( op ? String( Math.abs( op.sum ) / 100 ) : '' )
		}

		@ $mol_mem
		got_text( next?: string ) {
			const op = this.op()
			return next ?? ( op?.got === undefined ? '' : String( op.got / 100 ) )
		}

		@ $mol_mem
		note( next?: string ) {
			return next ?? this.op()?.note ?? ''
		}

		@ $mol_mem
		every( next?: string ) {
			return next ?? 'none'
		}

		category_current() {
			return this.op()?.category || this.category()
		}

		foreign() {
			if( !this.transfer() ) return false
			const accounts = this.book().accounts()
			const from = accounts.get( this.from() )
			const to = accounts.get( this.to() )
			return Boolean( from && to && from.cur !== to.cur )
		}

		keys() {
			return marks.map( mark => this.Key( mark ) )
		}

		key_title( mark: string ) {
			return mark
		}

		@ $mol_action
		back() {
			this.press( '⌫' )
		}

		@ $mol_action
		press( mark: string ) {
			this.text( $bog_molefy_calc_press( this.text(), mark ) )
		}

		category_buttons() {
			return [ ... this.book().categories() ]
				.filter( ([ id, row ])=> row.kind === this.kind() && ( !row.off || id === this.category_current() ) )
				.map( ([ id ])=> this.Category( id ) )
		}

		category_row( id: string ) {
			return this.book().categories().get( id )
		}

		category_name( id: string ) {
			return this.category_row( id )?.name ?? ''
		}

		category_icon( id: string ) {
			return this.category_row( id )?.icon ?? ''
		}

		category_color( id: string ) {
			return $bog_molefy_icon_color( this.category_icon( id ) )
		}

		@ $mol_action
		category_pick( id: string ) {
			this.save( id )
		}

		@ $mol_action
		submit() {
			this.save( this.category_current() )
		}

		save( category: string ) {
			const cents = Math.abs( $bog_molefy_calc( this.text() ) )
			const day = this.day()
			if( !cents || !day ) return
			const old = this.op()
			const op = {
				day,
				time: old?.time ?? new $mol_time_moment().toString( 'hh:mm' ),
				account: this.from(),
				category: this.transfer() ? '' : category,
				sum: this.transfer() || this.kind() === 'in' ? cents : - cents,
				note: this.note().trim(),
				... this.transfer() ? { to: this.to() } : {},
				... this.foreign() ? { got: Math.abs( $bog_molefy_calc( this.got_text() ) ) } : {},
			}
			if( this.transfer() && op.account === op.to ) return
			if( !this.transfer() && !category ) return
			if( this.foreign() && !op.got ) return
			const id = this.id() || $mol_guid()
			if( old && old.day.slice( 0, 7 ) !== day.slice( 0, 7 ) ) this.book().op_drop( id, old.day.slice( 0, 7 ) )
			this.book().op_put( id, op )
			const every = this.every()
			if( !this.id() && every !== 'none' ) {
				this.book().repeat_put( $mol_guid(), { every, next: $bog_molefy_shift( day, every, 1 ), op } )
			}
			this.reset()
			this.close( null )
		}

		reset() {
			this.text( '' )
			this.got_text( '' )
			this.note( '' )
			this.every( 'none' )
		}

		@ $mol_action
		drop() {
			const op = this.op()
			if( op ) this.book().op_drop( this.id(), op.day.slice( 0, 7 ) )
			this.close( null )
		}

	}

}
