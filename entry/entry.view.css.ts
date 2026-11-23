namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_molefy_entry, {
		flex: { basis: rem(26), shrink: 0, grow: 0 },
		Amount: {
			font: { size: '2rem' },
			textAlign: 'right',
		},
		Accounts: {
			align: { items: 'center' },
		},
		Body_content: {
			gap: $mol_gap.block,
			padding: $mol_gap.block,
		},
		Keys: {
			display: 'grid',
			gridTemplateColumns: 'repeat(4,1fr)',
			gap: $mol_gap.space,
		},
		Key: {
			justify: { content: 'center' },
			background: { color: $mol_theme.card },
			font: { size: '1.25rem' },
			minHeight: '3rem',
		},
		Categories: {
			display: 'grid',
			gridTemplateColumns: 'repeat(4,1fr)',
		},
		Category: {
			flex: { direction: 'column' },
			align: { items: 'center' },
			gap: 0,
			textAlign: 'center',
		},
		Category_icon: {
			width: '2rem',
			height: '2rem',
		},
		Category_name: {
			font: { size: '.8rem' },
			color: $mol_theme.text,
			wordBreak: 'break-word',
		},
	} )

}
