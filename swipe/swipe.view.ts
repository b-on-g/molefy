namespace $.$$ {

	export class $bog_molefy_swipe extends $.$bog_molefy_swipe {

		from = null as null | { x: number, y: number }

		start( event: PointerEvent ) {
			if( event.isPrimary && !event.button ) this.from = { x: event.clientX, y: event.clientY }
		}

		move( event: PointerEvent ) {
			if( !this.from || !event.isPrimary ) return
			const shift = Math.abs( event.clientX - this.from.x )
			if( shift < 12 || shift < Math.abs( event.clientY - this.from.y ) ) return
			this.dom_node().setPointerCapture?.( event.pointerId )
		}

		end( event: PointerEvent ) {
			const from = this.from
			if( !from || !event.isPrimary ) return
			this.from = null
			const x = event.clientX - from.x
			if( Math.abs( x ) < 48 || Math.abs( x ) < Math.abs( event.clientY - from.y ) * 2 ) return
			if( x < 0 ) this.to_left( event )
			else this.to_right( event )
		}

		cancel() {
			this.from = null
		}

	}

}
