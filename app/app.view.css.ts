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
			Foot: { align: { items: 'center' }, padding: $mol_gap.block },
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
			width: rem(4),
			height: rem(4),
			minWidth: rem(4),
			padding: 0,
			align: { items: 'center' },
			justify: { content: 'center' },
			border: { radius: '50%', width: '3px', style: 'solid', color: '#d9534f' },
			color: '#d9534f',
		},
		Minus_icon: {
			width: '2rem',
			height: '2rem',
		},
		Plus: {
			width: rem(4),
			height: rem(4),
			minWidth: rem(4),
			padding: 0,
			align: { items: 'center' },
			justify: { content: 'center' },
			border: { radius: '50%', width: '3px', style: 'solid', color: '#2f9e6e' },
			color: '#2f9e6e',
		},
		Plus_icon: {
			width: '2rem',
			height: '2rem',
		},
		Balance: {
			flex: { grow: 1 },
			align: { items: 'center' },
			justify: { content: 'center' },
			margin: { left: rem(1), right: rem(1) },
			minHeight: rem(3),
			border: { radius: '.5rem' },
			font: { weight: 'bold' },
			color: '#ffffff',
			background: { color: '#2f9e6e' },
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
