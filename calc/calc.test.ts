namespace $ {

	$mol_test({

		'expression by priority'() {
			$mol_assert_equal( $bog_molefy_calc( '2+3×4−1' ), 1300 )
			$mol_assert_equal( $bog_molefy_calc( '10÷4' ), 250 )
			$mol_assert_equal( $bog_molefy_calc( '5+' ), 500 )
			$mol_assert_equal( $bog_molefy_calc( '12,5' ), 1250 )
		},

		'typing by keys'() {
			const text = [ '0', '5', '.', '2', '5', '9', '+', '×', '2', '⌫', '4' ].reduce( $bog_molefy_calc_press, '' )
			$mol_assert_equal( text, '5.25×4' )
			$mol_assert_equal( $bog_molefy_calc_press( text, '=' ), '21' )
		},

	})

}
