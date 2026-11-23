namespace $ {

	export type $bog_molefy_ring_part = { id: string, name: string, icon: string, sum: number }

}

namespace $.$$ {

	export class $bog_molefy_ring extends $.$bog_molefy_ring {

		part( id: string ) {
			return this.parts().find( part => part.id === id )!
		}

		total() {
			return this.parts().reduce( ( sum, part )=> sum + Math.max( 0, part.sum ), 0 )
		}

		arcs() {
			const used = this.used()
			return [ ... used.filter( part => this.line_clear( part.id ) ).map( part => this.Line( part.id ) ), ... used.map( part => this.Arc( part.id ) ) ]
		}

		spots() {
			return this.parts().map( part => this.Spot( part.id ) )
		}

		part_name( id: string ) {
			return this.part( id ).name
		}

		part_icon( id: string ) {
			return this.part( id ).icon
		}

		part_color( id: string ) {
			return $bog_molefy_icon_color( this.part( id ).icon )
		}

		part_share( id: string ) {
			const sum = this.part( id ).sum
			if( sum <= 0 ) return ''
			const share = Math.round( sum / this.total() * 100 )
			return share ? share + '%' : '<1%'
		}

		part_pick( id: string ) {
			this.pick( id )
		}

		@ $mol_mem_key
		arc_range( id: string ) {
			let from = 0
			for( const part of this.parts() ) {
				if( part.id === id ) break
				from += Math.max( 0, part.sum )
			}
			const total = this.total()
			return [ from / total, Math.min( this.part( id ).sum / total, .9999 ) ]
		}

		used() {
			return this.parts().filter( part => part.sum > 0 )
		}

		spot_angle( id: string ) {
			const [ left, top ] = this.spot_place( id )
			return Math.atan2( top * 1.2 - 60, left - 50 ) / Math.PI / 2
		}

		@ $mol_mem
		turn() {
			const gaps = this.used().map( ({ id })=> {
				const [ from, size ] = this.arc_range( id )
				return this.spot_angle( id ) - from - size / 2
			} )
			const miss = ( turn: number )=> gaps.reduce( ( sum, gap )=> sum + Math.abs( gap - turn - Math.round( gap - turn ) ), 0 )
			const turns = Array.from( { length: 72 }, ( _, step )=> step / 72 )
			return turns.reduce( ( best, turn )=> miss( turn ) < miss( best ) ? turn : best, 0 )
		}

		point( share: number, radius: number ) {
			const angle = ( share + this.turn() ) * Math.PI * 2
			return [ 50 + Math.cos( angle ) * radius, 60 + Math.sin( angle ) * radius ]
		}

		arc_geometry( id: string ) {
			const [ from, size ] = this.arc_range( id )
			const start = this.point( from, 23 ).map( num => num.toFixed( 3 ) ).join( ' ' )
			const end = this.point( from + size, 23 ).map( num => num.toFixed( 3 ) ).join( ' ' )
			return `M ${ start } A 23 23 0 ${ size > .5 ? 1 : 0 } 1 ${ end }`
		}

		line_clear( id: string ) {
			const [ from, size ] = this.arc_range( id )
			const [ x, y ] = this.point( from + size / 2, 28 )
			const [ left, top ] = this.spot_place( id )
			return Array.from( { length: 20 }, ( _, step )=> step / 20 ).every( part =>
				Math.hypot( x + ( left - x ) * part - 50, y + ( top * 1.2 - y ) * part - 60 ) >= 27.5
			)
		}

		line_geometry( id: string ) {
			const [ from, size ] = this.arc_range( id )
			const [ x, y ] = this.point( from + size / 2, 27 )
			const [ left, top ] = this.spot_place( id )
			const [ dx, dy ] = [ left - x, top * 1.2 - y ]
			const keep = Math.max( 0, 1 - 8 / Math.hypot( dx, dy ) )
			return `M ${ x.toFixed( 3 ) } ${ y.toFixed( 3 ) } L ${ ( x + dx * keep ).toFixed( 3 ) } ${ ( y + dy * keep ).toFixed( 3 ) }`
		}

		@ $mol_mem_key
		spot_place( id: string ) {
			const index = this.parts().findIndex( part => part.id === id )
			const slots = Math.max( 2, Math.ceil( this.parts().length / 4 ) )
			const side = index / slots
			const along = index % slots / slots * 84
			return [ [ 8 + along, 7 ], [ 92, 7 + along ], [ 92 - along, 91 ], [ 8, 91 - along ] ][ Math.floor( side ) ]
		}

		spot_left( id: string ) {
			return this.spot_place( id )[0] + '%'
		}

		spot_top( id: string ) {
			return this.spot_place( id )[1] + '%'
		}

	}

}
