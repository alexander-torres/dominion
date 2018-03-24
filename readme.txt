GAME FLOW

Setup Phase:
+	Make cards with all properties
+	Pick/randomize kingdom cards for gameplay
+	Add treasure/victory point cards to gameplay
+	Assign players and deal out starting decks
+	Shuffle player decks

Player Turn:
	Start turn:
	+	player makes sure their deck has enough cards, or shuffles in
		discard pile
	+	player draws 5 cards

	Action phase (interactive):
	-	player plays action cards until they run out of actions
		(+action/buy/discard/draw/gain/treasure)
		-	player stops playing action cards or runs out of actions or
			action cards

	Buy phase (interactive):
	-	player uses total buys and treasure to gain cards (add treasure
		per draw? Or at beginning of 'buy' phase?)
		- player stops buying cards or runs out of treasure

	End turn:
	-	player discards their hand


	Action Phase:
	-	deal out cards
	-	add click listeners to kingdom cards with card action placed in
		handler
	-	check for kingdom cards and number of actions left in play
	{LOOP}
	-	player clicks kingdom card and fires handler:
		+	replace 'hand' class with 'played' for kingdom card element in DOM
		+	remove listener from kingdom card element in DOM
		+	check for kingdom cards and number of actions left in play
	{/LOOP}
	-	No actions are available, player has run out of kingdom cards,
		or player skips to buy phase
		+	remove listeners from the rest of the kingdom card elements
		+	change turn phase to 'buy'