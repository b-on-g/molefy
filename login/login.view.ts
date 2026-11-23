namespace $.$$ {

	export class $bog_molefy_login extends $.$bog_molefy_login {

		id_enter() {
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			this.$.$bog_id_login( this.provider(), pass, 'molefy' )
				.then( grant => this.grant( grant ) )
				.catch( error => this.status( error.message ) )
		}

		key_make() {
			$mol_wire_async( this ).own( 'make' )
		}

		key_enter() {
			const key = decodeURIComponent( this.key().trim() )
			if( key.length < 160 || /\s/.test( key ) ) return this.status( 'Это не ключ' )
			this.key( '' )
			this.own( key )
		}

	}

}
