namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_molefy_app, {
		Login: {
			flex: { basis: rem(30), grow: 1 },
			Body_content: { padding: $mol_gap.block },
		},
		Wait: {
			flex: { basis: rem(30), grow: 1 },
			Body_content: { padding: $mol_gap.block },
		},
		Menu: {
			flex: { basis: rem(20), shrink: 0, grow: 0 },
			Body_content: { padding: $mol_gap.block, gap: $mol_gap.block },
		},
		Account: {
			justify: { content: 'space-between' },
		},
		Account_name: {
			flex: { grow: 1 },
		},
		Main: {
			flex: { basis: rem(26), shrink: 0, grow: 1 },
			Head: { align: { items: 'center' } },
		},
		Period_title: {
			flex: { grow: 1 },
			justify: { content: 'center' },
			textAlign: 'center',
		},
		Budget: {
			textAlign: 'center',
		},
		Minus: {
			padding: $mol_gap.block,
			border: { radius: $mol_gap.round },
			color: $mol_theme.focus,
			background: { color: $mol_theme.card },
		},
		Plus: {
			padding: $mol_gap.block,
			border: { radius: $mol_gap.round },
			color: $mol_theme.current,
			background: { color: $mol_theme.card },
		},
		Minus_icon: {
			width: '2rem',
			height: '2rem',
		},
		Plus_icon: {
			width: '2rem',
			height: '2rem',
		},
		Balance: {
			align: { items: 'center' },
			flex: { grow: 1 },
			justify: { content: 'center' },
			font: { weight: 'bold' },
		},
		Feed: {
			flex: { basis: rem(28), shrink: 0, grow: 0 },
		},
		Search: {
			flex: { basis: rem(28), shrink: 0, grow: 0 },
			Body_content: { padding: $mol_gap.block },
		},
		Op: {
			justify: { content: 'space-between' },
		},
		Op_title: {
			flex: { grow: 1 },
		},
		Op_sum: {
			whiteSpace: 'nowrap',
		},
	} )

}
