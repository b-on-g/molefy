namespace $ {

	export class $bog_molefy_store extends $giper_baza_dict.with({
		Accounts: $giper_baza_dict_to( $giper_baza_atom_text ),
		Categories: $giper_baza_dict_to( $giper_baza_atom_text ),
		Repeats: $giper_baza_dict_to( $giper_baza_atom_text ),
		Settings: $giper_baza_dict_to( $giper_baza_atom_text ),
		Rates: $giper_baza_dict_to( $giper_baza_atom_text ),
		Ops: $giper_baza_dict_to( $giper_baza_dict_to( $giper_baza_atom_text ) ),
	}) {}

	export class $bog_molefy_home extends $giper_baza_dict.with({
		Land: $giper_baza_atom_text,
	}, 'bog_molefy' ) {}

	export type $bog_molefy_kind = 'in' | 'out'

	export type $bog_molefy_account = {
		name: string
		icon: string
		cur: string
		init: number
		total: boolean
		off: boolean
		pos: number
	}

	export type $bog_molefy_category = {
		name: string
		kind: $bog_molefy_kind
		icon: string
		off: boolean
		pos: number
	}

	export type $bog_molefy_op = {
		day: string
		time: string
		account: string
		category: string
		sum: number
		note: string
		to?: string
		got?: number
	}

	export type $bog_molefy_repeat = {
		every: string
		next: string
		op: $bog_molefy_op
	}

	export type $bog_molefy_period = 'day' | 'week' | 'month' | 'year' | 'all' | 'range'

	export function $bog_molefy_today() {
		return new $mol_time_moment().toString( 'YYYY-MM-DD' )
	}

	export function $bog_molefy_shift( day: string, every: string, count: number ) {
		const moment = new $mol_time_moment( day )
		if( every === 'day' ) return moment.shift({ day: count }).toString( 'YYYY-MM-DD' )
		if( every === 'week' ) return moment.shift({ day: count * 7 }).toString( 'YYYY-MM-DD' )
		const months = moment.month! + ( every === 'year' ? 12 : 1 ) * count
		const first = new Date( Date.UTC( moment.year!, months, 1 ) )
		const last = new Date( Date.UTC( moment.year!, months + 1, 0 ) ).getUTCDate()
		first.setUTCDate( Math.min( moment.day! + 1, last ) )
		return first.toISOString().slice( 0, 10 )
	}

	export function $bog_molefy_range( period: $bog_molefy_period, day: string ): [ string, string ] {
		if( period === 'day' ) return [ day, day ]
		if( period === 'week' ) {
			const from = $bog_molefy_shift( day, 'day', - new $mol_time_moment( day ).weekday )
			return [ from, $bog_molefy_shift( from, 'day', 6 ) ]
		}
		if( period === 'month' ) {
			const from = day.slice( 0, 7 ) + '-01'
			return [ from, $bog_molefy_shift( $bog_molefy_shift( from, 'month', 1 ), 'day', -1 ) ]
		}
		if( period === 'year' ) return [ day.slice( 0, 4 ) + '-01-01', day.slice( 0, 4 ) + '-12-31' ]
		return [ '0000-01-01', '9999-12-31' ]
	}

	export function $bog_molefy_money( cents: number, cur: string ) {
		const digits = cents % 100 ? 2 : 0
		const options = { minimumFractionDigits: digits, maximumFractionDigits: digits }
		if( !/^[A-Z]{3}$/.test( cur ) ) return new Intl.NumberFormat( 'ru-RU', options ).format( cents / 100 )
		return new Intl.NumberFormat( 'ru-RU', { ... options, style: 'currency', currency: cur } ).format( cents / 100 )
	}

	export function $bog_molefy_cents( text: string ) {
		let raw = text.replace( /[^\d.,+-]/g, '' )
		const dot = Math.max( raw.lastIndexOf( '.' ), raw.lastIndexOf( ',' ) )
		if( dot >= 0 ) {
			const mark = raw[ dot ]
			const mixed = raw.includes( '.' ) && raw.includes( ',' )
			const grouped = !mixed && ( raw.split( mark ).length > 2 || ( mark === ',' && raw.length - dot === 4 ) )
			raw = grouped
				? raw.replace( /[.,]/g, '' )
				: raw.slice( 0, dot ).replace( /[.,]/g, '' ) + '.' + raw.slice( dot + 1 )
		}
		return Math.round( Number( raw ) * 100 ) || 0
	}

}
