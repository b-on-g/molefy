namespace $ {

	$mol_test({

		'arcs are drawn only for spent and lines never cross ring'( $ ) {
			const ring = $bog_molefy_ring.make({ $ }) as $$.$bog_molefy_ring
			const sums = [ 0, 5, 300, 0, 40, 200, 1, 0, 90, 0, 0, 30 ]
			ring.parts = ()=> sums.map( ( sum, index )=> ({ id: String( index ), name: '', icon: 'food', sum }) )

			$mol_assert_equal( ring.spots().length, 12 )
			$mol_assert_equal( ring.arcs().filter( view => ring.used().some( part => ring.Arc( part.id ) === view ) ).length, 7 )
			for( const { id } of ring.used() ) {
				if( !ring.line_clear( id ) ) $mol_assert_equal( ring.arcs().includes( ring.Line( id ) ), false )
			}
			$mol_assert_equal( ring.part_share( '6' ), '<1%' )
			$mol_assert_equal( ring.part_share( '0' ), '' )
		},

	})

}
