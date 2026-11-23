namespace $ {

	const order: Record< string, number > = { '+': 1, '−': 1, '×': 2, '÷': 2 }

	/** Computes arithmetic expression to cents */
	export function $bog_molefy_calc( text: string ) {
		const tokens = text.replace( /,/g, '.' ).match( /[\d.]+|[+−×÷]/g ) ?? []
		const nums = [] as number[]
		const marks = [] as string[]
		const apply = ()=> {
			const right = nums.pop()!
			const left = nums.pop()!
			const mark = marks.pop()!
			nums.push( mark === '+' ? left + right : mark === '−' ? left - right : mark === '×' ? left * right : right ? left / right : 0 )
		}
		tokens.forEach( ( token, index )=> {
			if( !order[ token ] ) return nums.push( Number( token ) || 0 )
			if( index === tokens.length - 1 || !nums.length ) return
			while( marks.length && order[ marks.at( -1 )! ] >= order[ token ] ) apply()
			marks.push( token )
		} )
		while( marks.length ) apply()
		return Math.round( ( nums[0] ?? 0 ) * 100 )
	}

	/** Adds pressed key to expression */
	export function $bog_molefy_calc_press( text: string, key: string ) {
		if( key === '⌫' ) return text.slice( 0, -1 )
		if( key === '=' ) return String( $bog_molefy_calc( text ) / 100 ).replace( '-', '' )
		if( order[ key ] ) return text ? text.replace( /[+−×÷]$/, '' ) + key : ''
		const last = text.match( /[\d.]*$/ )![0]
		if( key === '.' ) return last.includes( '.' ) ? text : text + ( last ? '.' : '0.' )
		if( /\.\d\d$/.test( last ) ) return text
		return last === '0' ? text.slice( 0, -1 ) + key : text + key
	}

}
