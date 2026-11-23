namespace $ {

	function app_make( $: $ ) {
		const app = $bog_molefy_app.make({ $ }) as $$.$bog_molefy_app
		app.store = ()=> $.$giper_baza_glob.home().land().Data( $bog_molefy_store )
		new $mol_wire_atom( 'bog_molefy_test_keep', ()=> app.store() ).fresh()
		$.$mol_state_arg.dict({})
		app.Book().seed()
		return app
	}

	function spend( app: $$.$bog_molefy_app, key: string, sum: string, category: string ) {
		const entry = app.Entry( key ) as $$.$bog_molefy_entry
		entry.text( sum )
		if( category ) entry.category_pick( category )
		else entry.submit()
	}

	$mol_test({

		'expense and income change balance and ring'( $ ) {
			const app = app_make( $ )
			spend( app, 'out::', '200+50', 'food' )
			spend( app, 'in::', '1000', 'in_cash' )

			$mol_assert_equal( app.period_balance(), 75000 )
			$mol_assert_equal( app.parts().find( part => part.id === 'food' )!.sum, 25000 )
			$mol_assert_equal( app.account_balance( 'cash' ), $bog_molefy_money( 75000, 'RUB' ) )
			$mol_assert_equal( ( app.Entry( 'out::' ) as $$.$bog_molefy_entry ).text(), '' )
		},

		'category is chosen only after amount'( $ ) {
			const app = app_make( $ )
			const entry = app.Entry( 'out::' ) as $$.$bog_molefy_entry
			$mol_assert_equal( entry.filled(), false )
			entry.press( '7' )
			$mol_assert_equal( entry.filled(), true )
			entry.choose()
			$mol_assert_equal( entry.fields(), [ entry.Amount_row(), entry.Categories() ] )
			entry.category_pick( 'food' )
			$mol_assert_equal( entry.choosing(), false )
			$mol_assert_equal( app.period_balance(), -700 )
		},

		'operation moves to other month and drops'( $ ) {
			const app = app_make( $ )
			spend( app, 'out::', '10', 'food' )
			const id = app.ops()[0][0]
			const entry = app.Entry( `out:${ id }:` ) as $$.$bog_molefy_entry
			entry.day( '2020-02-29' )
			entry.submit()

			$mol_assert_equal( app.ops().length, 0 )
			app.day( '2020-02-01' )
			$mol_assert_equal( app.ops().map( pair => pair[0] ), [ id ] )
			entry.drop()
			$mol_assert_equal( app.ops().length, 0 )
		},

		'transfer keeps total'( $ ) {
			const app = app_make( $ )
			spend( app, 'transfer::', '300', '' )

			const book = app.Book()
			$mol_assert_equal( book.balance([ 'cash', '9999-12-31' ]), -30000 )
			$mol_assert_equal( book.balance([ 'card', '9999-12-31' ]), 30000 )
			$mol_assert_equal( book.balance([ '', '9999-12-31' ]), 0 )
		},

		'other currency is converted by rate'( $ ) {
			const app = app_make( $ )
			const book = app.Book()
			book.account_put( 'usd', { name: 'USD', icon: 'card', cur: 'USD', init: 1000, total: true, off: false, pos: 9 } )
			book.rate( 'USD', '90' )
			$mol_assert_equal( book.balance([ '', '9999-12-31' ]), 90000 )
			$mol_assert_equal( book.balance([ 'usd', '9999-12-31' ]), 1000 )
		},

		'repeat creates missed operations once and keeps month end'( $ ) {
			const app = app_make( $ )
			const book = app.Book()
			const op = { day: '2020-01-31', time: '', account: 'cash', category: 'food', sum: -100, note: '' }
			book.repeat_put( 'r', { every: 'month', next: '2020-02-29', op } )
			book.repeats_run()

			$mol_assert_equal( [ ... book.month_ops( '2020-02' ).values() ].map( row => row.day ), [ '2020-02-29' ] )
			$mol_assert_equal( [ ... book.month_ops( '2020-03' ).values() ].map( row => row.day ), [ '2020-03-31' ] )
			$mol_assert_equal( book.repeats_due().length, 0 )
		},

		'budget and carry'( $ ) {
			const app = app_make( $ )
			const settings = app.Settings() as $$.$bog_molefy_settings
			settings.budget( '100' )
			spend( app, 'out::', '130', 'food' )
			$mol_assert_equal( app.budget_text(), `Бюджет превышен на ${ app.money( 3000 ) }` )

			app.next()
			$mol_assert_equal( app.period_balance(), 0 )
			settings.carry( true )
			$mol_assert_equal( app.period_balance(), -13000 )
		},

		async 'empty book offers ready accounts'( $ ) {
			const app = app_make( $ )
			for( const id of [ 'cash', 'card' ] ) app.Book().store()!.Accounts()!.has( id, false )
			$mol_assert_equal( app.main_body(), [ app.Seed() ] )
			await app.seed()
			$mol_assert_equal( app.main_body(), [ app.Period_bar(), app.Ring() ] )
		},

		'drawers open over main and swipe turns period'( $ ) {
			const app = app_make( $ )
			app.mode( 'own' )
			$.$mol_state_arg.dict( app.menu_arg() )
			$mol_assert_equal( app.pages(), [ app.Main(), app.Shade(), app.Menu() ] )
			app.Menu_swipe().to_left( null )
			$mol_assert_equal( app.pages(), [ app.Main() ] )
			app.day( '2025-03-10' )
			app.Main_swipe().to_left( null )
			$mol_assert_equal( app.day(), '2025-04-10' )
			app.Main_swipe().to_right( null )
			$mol_assert_equal( app.day(), '2025-03-10' )
		},

		'choice of entrance'( $ ) {
			const app = $bog_molefy_app.make({ $ }) as $$.$bog_molefy_app
			$mol_assert_equal( app.pages(), [ app.Login() ] )
			app.mode( 'own' )
			$mol_assert_equal( app.pages(), [ app.Wait() ] )
		},

		async 'own key makes encrypted book, data moves to granted land'( $ ) {
			const app = $bog_molefy_app.make({ $ }) as $$.$bog_molefy_app
			new $mol_wire_atom( 'bog_molefy_test_own', ()=> app.own_store() ).fresh()
			await $mol_wire_async( app ).own_make()
			$mol_assert_equal( app.own_store()!.land().encrypted(), true )
			$mol_assert_equal( app.pages(), [ app.Main() ] )

			const target = $bog_molefy_book.make({ $, store: ()=> $.$giper_baza_glob.home().land().Data( $bog_molefy_store ) })
			await $mol_wire_async( target ).copy_from( app.Own_book() )
			$mol_assert_equal( target.categories().size, app.Own_book().categories().size )
		},

		'category opens entry and closes'( $ ) {
			const app = app_make( $ )
			app.part_pick( 'food' )
			$mol_assert_equal( app.details(), [ app.Entry( 'out::food' ) ] )
			app.close()
			$mol_assert_equal( app.details(), [] )
		},

		'cleanup'( $ ) {
			$.$mol_state_arg.dict({})
		},

	})

}
