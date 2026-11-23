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
			return this.parts().filter( part => part.sum > 0 ).map( part => this.Arc( part.id ) )
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
			return sum > 0 ? Math.round( sum / this.total() * 100 ) + '%' : ''
		}

		part_pick( id: string ) {
			this.pick( id )
		}

		@ $mol_mem_key
		arc_geometry( id: string ) {
			let from = 0
			for( const part of this.parts() ) {
				if( part.id === id ) break
				from += Math.max( 0, part.sum )
			}
			const total = this.total()
			const size = Math.min( this.part( id ).sum / total, .9999 )
			const point = ( share: number )=> {
				const angle = ( share - .25 ) * Math.PI * 2
				return `${ ( 50 + Math.cos( angle ) * 25 ).toFixed( 3 ) } ${ ( 50 + Math.sin( angle ) * 25 ).toFixed( 3 ) }`
			}
			return `M ${ point( from / total ) } A 25 25 0 ${ size > .5 ? 1 : 0 } 1 ${ point( from / total + size ) }`
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
