window.onload = init;

let test;

function init() {
	function Card(qty, cost, value, victoryPoints, action, attack) {
		this.qty = qty;
		this.cost = cost;
		this.value = value;
		this.victoryPoints = victoryPoints;
		this.action = action;
		this.attack = attack;
	}

	function Action(plusAction, plusBuy, plusCard, func) {
		this.plusAction = plusAction;
		this.plusBuy = plusBuy;
		this.plusCard = plusCard;
		this.func = func;
	}

	const cards = {
		kingdom_cards: {
			adventurer:		new Card(10, 6, 0, 0, new Action(0, 0, 0)),
			bureaucrat:		new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			cellar: 		new Card(10, 2, 0, 0, new Action(1, 0, 0)),
			chancellor: 	new Card(10, 3, 2, 0, new Action(0, 0, 0)),
			chapel: 		new Card(10, 2, 0, 0, new Action(0, 0, 0)),
			council_room: 	new Card(10, 5, 0, 0, new Action(0, 1, 4)),
			feast:			new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			festival: 		new Card(10, 5, 2, 0, new Action(2, 1, 0)),
			gardens: 		new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			laboratory: 	new Card(10, 5, 0, 0, new Action(1, 0, 2)),
			library: 		new Card(10, 5, 0, 0, new Action(0, 0, 0)),
			market: 		new Card(10, 5, 1, 0, new Action(1, 1, 1)),
			militia: 		new Card(10, 4, 2, 0, new Action(0, 0, 0)),
			mine:			new Card(10, 5, 0, 0, new Action(0, 0, 0)),
			moat:			new Card(10, 0, 0, 0, new Action(0, 0, 2)),
			moneylender: 	new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			remodel: 		new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			smithy: 		new Card(10, 4, 0, 0, new Action(0, 0, 3)),
			spy:			new Card(10, 4, 0, 0, new Action(1, 0, 1)),
			thief:			new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			throne_room: 	new Card(10, 4, 0, 0, new Action(0, 0, 0)),
			village: 		new Card(10, 3, 0, 0, new Action(2, 0, 1)),
			witch:			new Card(10, 5, 0, 0, new Action(0, 0, 2)),
			woodcutter:		new Card(10, 3, 2, 0, new Action(0, 1, 0)),
			workshop:		new Card(10, 3, 0, 0, new Action(0, 0, 0))
		},
		penalty_cards: {
			curse:			new Card(30, 0, 0, -1)
		},
		treasure_cards: {
			copper:			new Card(60, 0, 1, 0),
			gold:			new Card(30, 6, 3, 0),
			silver:			new Card(40, 3, 2, 0)
		},
		victory_cards: {
			duchy:			new Card(12, 5, 0, 3),
			estate:			new Card(24, 2, 0, 1),
			province:		new Card(12, 8, 0, 6)
		}
	};

	for (let cardCategory in cards) {
		for (let cardName in cards[cardCategory]) {
			cards[cardCategory][cardName].name = cardName;
		}
	}

	function shuffle(deck, num) {
		let toShuffle = [];
		let shuffled = {arr: [], obj: {}};

		for (let cardName in deck) {
			toShuffle.push([Math.random(), deck[cardName], cardName]);
		}

		toShuffle.sort();

		num = num || toShuffle.length;

		for (let i = 0; i < num; i++) {
			shuffled.arr.push(toShuffle[i][1]);
			shuffled.obj[toShuffle[i][2]] = toShuffle[i][1];
		}

		if (Array.isArray(deck)) {
			return shuffled.arr;
		}

		return shuffled.obj;
	}

	// Assign cards to board and players
	let cardsInPlay = {};
	let numPlayers = 2;
	let players = {};

	// Add treasure and victory cards to board
	cardsInPlay.treasure_cards = cards.treasure_cards;
	cardsInPlay.victory_cards = cards.victory_cards;
	cardsInPlay.kingdom_cards = {};

	for (let card in cardsInPlay.victory_cards) {
		cardsInPlay.victory_cards[card].qty = 8 + 4 * (numPlayers > 2);
	}

	// Pick ten random kingdom cards for gameplay
	cardsInPlay.kingdom_cards = shuffle(cards.kingdom_cards, 10);

	// Make player profiles and deal out starting decks
	for (let i = 1; i <= numPlayers; i++) {
		players['player' + i] = {
			cards: {
				deck: [],
				discard: [],
				hand: []
			}
		};

		dealPlayerCards(players['player' + i]);

		players['player' + i].cards.deck = shuffle(players['player' + i].cards.deck);
	}

	function dealPlayerCards(player) {
		for (let i = 0; i < 10; i++) {
			if (i < 7) {
				player.cards.deck.push(cards.treasure_cards.copper);
			} else {
				player.cards.deck.push(cards.victory_cards.estate);
			}
		}
	}

	function printCards(cards, targetSelector) {
		let target = document.querySelector(targetSelector);

		for (let card in cards) {
			let img = document.createElement('img');

			img.className = 'card ' + cards[card].name;

			target.append(img);
		}
	}

	printCards(cardsInPlay.victory_cards, '#cardsInPlay .victory-cards');
	printCards(cardsInPlay.treasure_cards, '#cardsInPlay .treasure-cards');
	printCards(cardsInPlay.kingdom_cards, '#cardsInPlay .kingdom-cards');
	printCards(players.player1.cards.deck, '#playerCards .deck');

	function drawCard(fromCardPile, toCardPile) {
		if (Array.isArray(fromCardPile)) {
			toCardPile.push(fromCardPile.pop());
		}

		else {
			toCardPile.push(fromCardPile);
			fromCardPile.qty--;
		}
	}

	function getCard(cardCategory, cardName, player) {

		if (cardsInPlay[cardCategory][cardName].qty > 0) {
			drawCard(cardsInPlay[cardCategory][cardName], player.cards.discard);

			return true;
		}

		alert('There are no more cards in this stack');
	}

	test = cards;
}