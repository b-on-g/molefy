namespace $ {

	const base = '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'

	function book_make( $: $ ) {
		const book = $bog_molefy_book.make({ $, store: ()=> $.$giper_baza_glob.home().land().Data( $bog_molefy_store ) })
		new $mol_wire_atom( 'bog_molefy_test_keep', ()=> book.store() ).fresh()
		return book
	}

	const csv = '﻿' + [
		'date,account,category,amount,currency,converted amount,currency,description',
		'29.01.2021,Карта,Еда,-28,RUB,-28,RUB,',
		'29.01.2021,Карта,Еда,-28,RUB,-28,RUB,',
		'30.01.2021,Карта,"Мерч ",1500.5,RUB,1500.5,RUB,"Значок, ""синий"""',
		'01.02.2021,Карта,ExpenseTransfer,-100,RUB,-100,RUB,',
		'01.02.2021,Копилка,IncomeTransfer,100,RUB,100,RUB,',
		'02.02.2021,Карта,ExpenseTransfer,-50,RUB,-50,RUB,',
		'03.02.2021,Копилка,InitialBalance,1855,RUB,1855,RUB,',
	].join( '\n' )

	async function unpack() {
		const packed = Uint8Array.from( atob( base ), char => char.charCodeAt( 0 ) )
		const stream = new Blob( [ packed ] ).stream().pipeThrough( new DecompressionStream( 'gzip' ) )
		return new Uint8Array( await new Response( stream ).arrayBuffer() )
	}

	$mol_test({

		'csv is restored with transfers and initial balance'( $ ) {
			const book = book_make( $ )
			const report = $bog_molefy_restore( book, $bog_molefy_csv_dump( csv ), false )

			$mol_assert_equal( report, { added: 5, same: 0, dropped: 0 } )
			const names = new Map( [ ...book.accounts() ].map( ([ id, row ])=> [ row.name, id ] ) )
			$mol_assert_equal( book.balance([ names.get( 'Карта' )!, '9999-12-31' ]), - 2800 * 2 + 150050 - 10000 - 5000 )
			$mol_assert_equal( book.balance([ names.get( 'Копилка' )!, '9999-12-31' ]), 195500 )
			$mol_assert_equal( book.balance([ '', '9999-12-31' ]), 185500 - 5600 + 150050 - 5000 )
			$mol_assert_equal( [ ...book.categories().values() ].map( row => row.name + row.kind ).sort(), [ 'Едаout', 'Мерчin' ] )
		},

		'second append adds nothing and replace drops extra'( $ ) {
			const book = book_make( $ )
			const dump = $bog_molefy_csv_dump( csv )
			$bog_molefy_restore( book, dump, false )
			$mol_assert_equal( $bog_molefy_restore( book, dump, false ), { added: 0, same: 5, dropped: 0 } )

			const less = { ...dump, ops: dump.ops.slice( 1 ) }
			$mol_assert_equal( $bog_molefy_restore( book, less, true ), { added: 0, same: 4, dropped: 1 } )
		},

		'export is restored without changes'( $ ) {
			const book = book_make( $ )
			$bog_molefy_restore( book, $bog_molefy_csv_dump( csv ), false )
			const report = $bog_molefy_restore( book, $bog_molefy_csv_dump( $bog_molefy_csv_export( book ) ), true )
			$mol_assert_equal( report, { added: 0, same: 5, dropped: 0 } )
		},

		'csv of other locale'() {
			const dump = $bog_molefy_csv_dump( 'date;account;category;amount;currency\n1/31/2021;A;B;-1 288,50;USD\n2/1/2021;A;B;-1,288.5;USD' )
			$mol_assert_equal( dump.ops.map( op => [ op.day, op.sum ] ), [ [ '2021-01-31', -128850 ], [ '2021-02-01', -128850 ] ] )
		},

		async 'database is read with overflow, inner pages and deleted rows'() {
			const dump = $bog_molefy_restore_parse( await unpack() )
			$mol_assert_equal( dump.accounts.map( row => [ row.name, row.init, row.cur ] ), [ [ 'Карта', 0, 'RUB' ], [ 'Копилка', 1855000 / 10, 'RUB' ] ] )
			$mol_assert_equal( dump.ops.length, 44 )
			$mol_assert_equal( dump.ops[0].sum, -202200 )
			$mol_assert_equal( dump.ops[0].day, '2021-01-29' )
			$mol_assert_equal( dump.ops[1].note, 'длинная '.repeat( 90 ).trim() )
			$mol_assert_equal( dump.ops.filter( op => op.to !== undefined ).map( op => op.to ), [ 'Копилка', '' ] )
		},

		'broken file is rejected'() {
			$mol_assert_fail( ()=> $bog_molefy_csv_dump( 'a,b\n1,2' ), 'В файле нет столбцов date, account, category, amount' )
		},

	})

}
