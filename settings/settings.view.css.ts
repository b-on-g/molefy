namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_molefy_settings, {
		flex: { basis: rem(28), shrink: 0, grow: 0 },
		Body_content: {
			gap: $mol_gap.block,
			padding: $mol_gap.block,
		},
		Repeat: {
			justify: { content: 'space-between' },
		},
	} )

}
