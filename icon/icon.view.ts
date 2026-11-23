namespace $ {

	const icons = {
		food: $mol_icon_food_apple, home: $mol_icon_home_outline, car: $mol_icon_car, cafe: $mol_icon_coffee, bus: $mol_icon_bus,
		hygiene: $mol_icon_shower, fun: $mol_icon_movie_open, sport: $mol_icon_dumbbell, taxi: $mol_icon_taxi, health: $mol_icon_heart_pulse,
		clothes: $mol_icon_tshirt_crew, phone: $mol_icon_phone, gift: $mol_icon_gift, pet: $mol_icon_paw, cash: $mol_icon_cash,
		piggy: $mol_icon_piggy_bank, bank: $mol_icon_bank, bill: $mol_icon_file_document, gadget: $mol_icon_laptop, family: $mol_icon_account_group,
		promo: $mol_icon_bullhorn, work: $mol_icon_briefcase, study: $mol_icon_school, book: $mol_icon_book_open_variant, pill: $mol_icon_pill,
		hammer: $mol_icon_hammer, debt: $mol_icon_hand_coin, chart: $mol_icon_chart_line, plane: $mol_icon_airplane, baby: $mol_icon_baby_carriage,
		cart: $mol_icon_cart, wallet: $mol_icon_wallet, card: $mol_icon_credit_card, safe: $mol_icon_safe, tag: $mol_icon_tag, transfer: $mol_icon_swap_horizontal,
	}

	export const $bog_molefy_icon_names = Object.keys( icons ) as readonly string[]

	const legacy: Record< number, string > = {
		0: 'bill', 2: 'bank', 11: 'promo', 13: 'car', 15: 'card', 16: 'pet', 18: 'work', 20: 'clothes', 21: 'cash', 22: 'phone', 27: 'gadget', 28: 'pill',
		30: 'cafe', 34: 'fun', 39: 'food', 43: 'gift', 47: 'health', 52: 'book', 53: 'chart', 54: 'piggy', 60: 'home', 71: 'sport', 76: 'taxi',
		80: 'hygiene', 83: 'bus', 86: 'study', 94: 'family', 96: 'tag', 101: 'cart', 104: 'debt',
	}

	const words: [ RegExp, string ][] = [
		[ /ед[аы]|продукт|food|grocer/i, 'food' ], [ /дом|жиль|house|home|rent/i, 'home' ], [ /такси|taxi/i, 'taxi' ], [ /машин|авто|car$/i, 'car' ],
		[ /кафе|рест|eating|cafe/i, 'cafe' ], [ /транспорт|transport/i, 'bus' ], [ /гигиен|toilet/i, 'hygiene' ], [ /развлеч|entertain/i, 'fun' ],
		[ /спорт|sport/i, 'sport' ], [ /здоров|health/i, 'health' ], [ /одежд|cloth/i, 'clothes' ], [ /связь|communic/i, 'phone' ], [ /подар|gift/i, 'gift' ],
		[ /питом|pets?/i, 'pet' ], [ /зарплат|доход|налич|salary|cash/i, 'cash' ], [ /сбереж|копил|кубыш|saving/i, 'piggy' ], [ /депоз|банк|deposit/i, 'bank' ],
		[ /счет|налог|нолог|bills/i, 'bill' ], [ /гадж|техник/i, 'gadget' ], [ /семь|family/i, 'family' ], [ /обуч|образ|стипен|educ/i, 'study' ],
		[ /медиц|лекар/i, 'pill' ], [ /долг|друз/i, 'debt' ], [ /инвест/i, 'chart' ], [ /продвиж|реклам/i, 'promo' ], [ /работ|фриланс/i, 'work' ],
	]

	export function $bog_molefy_icon_legacy( code: number ) {
		return legacy[ code ] ?? ''
	}

	export function $bog_molefy_icon_guess( title: string, fallback: string ) {
		return words.find( ([ word ])=> word.test( title ) )?.[1] ?? fallback
	}

	export function $bog_molefy_icon_path( name: string ) {
		return ( icons[ name as keyof typeof icons ] ?? icons.tag ).make({}).path()
	}

	export function $bog_molefy_icon_color( name: string ) {
		const index = Math.max( 0, $bog_molefy_icon_names.indexOf( name ) )
		return `hsl( ${ index * 137 % 360 } 55% 50% )`
	}

}

namespace $.$$ {

	export class $bog_molefy_icon extends $.$bog_molefy_icon {

		@ $mol_mem
		path() {
			return $bog_molefy_icon_path( this.name() )
		}

	}

}
