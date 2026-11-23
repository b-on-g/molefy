namespace $.$$ {

	$mol_style_define( $bog_molefy_ring, {
		position: 'relative',
		aspectRatio: '5 / 6',
		width: '100%',
		maxWidth: '34rem',
		alignSelf: 'center',
		Chart: {
			position: 'absolute',
			inset: '0px',
			width: '100%',
			height: '100%',
		},
		Arc: {
			fill: 'none',
			strokeWidth: '9px',
		},
		Line: {
			fill: 'none',
			strokeWidth: '.5px',
			opacity: .6,
		},
		Center: {
			position: 'absolute',
			inset: '0px',
			flex: { direction: 'column' },
			align: { items: 'center' },
			justify: { content: 'center' },
			textAlign: 'center',
			pointerEvents: 'none',
		},
		Income: {
			color: '#2f9e6e',
		},
		Expense: {
			color: '#d9534f',
			font: { weight: 'bold' },
		},
		Spot: {
			position: 'absolute',
			transform: 'translate(-50%,-50%)',
			flex: { direction: 'column' },
			align: { items: 'center' },
			justify: { content: 'center' },
			padding: 0,
			minWidth: '2.75rem',
			minHeight: '3rem',
			gap: 0,
		},
		Spot_icon: {
			width: '1.75rem',
			height: '1.75rem',
		},
		Spot_share: {
			font: { size: '.75rem' },
			minHeight: '1rem',
			lineHeight: '1rem',
		},
	} )

}
