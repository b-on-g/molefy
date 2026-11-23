namespace $ {

	$mol_test({

		'only long horizontal move is swipe'( $ ) {
			const log = [] as string[]
			const swipe = $bog_molefy_swipe.make({ $, to_left: ()=> log.push( 'left' ), to_right: ()=> log.push( 'right' ) }) as $$.$bog_molefy_swipe
			const drag = ( x: number, y: number )=> {
				const at = ( x: number, y: number )=> ({ isPrimary: true, button: 0, clientX: x, clientY: y, pointerId: 1 }) as PointerEvent
				swipe.start( at( 100, 100 ) )
				swipe.end( at( 100 + x, 100 + y ) )
			}
			drag( -80, 10 )
			drag( 80, -10 )
			drag( 30, 0 )
			drag( 80, 70 )
			$mol_assert_equal( log, [ 'left', 'right' ] )
		},

	})

}
