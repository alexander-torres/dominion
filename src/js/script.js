// window.onload = init;

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

	function shuffle(deck) {
		let toShuffle = [];
		let shuffled = [];

		for (let card in deck) {
			toShuffle.push([Math.random(), deck[card]]);
		}

		toShuffle.sort();

		for (let i = 0; i < toShuffle.length; i++) {
			shuffled.push(toShuffle[i][1]);
		}

		return shuffled;
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
			estate:			new Card(24, 2, 0, 1),
			duchy:			new Card(12, 5, 0, 3),
			province:		new Card(12, 8, 0, 6)
		}
	};

	let cardsInPlay = {};
	let numPlayers = 2;
	let players = {};
	let shuffledNames = shuffle(Object.keys(cards.kingdom_cards));

	// Add treasure and victory cards
	cardsInPlay.treasure_cards = cards.treasure_cards;
	cardsInPlay.victory_cards = cards.victory_cards;
	cardsInPlay.kingdom_cards = {};
	
	for (let card in cardsInPlay.victory_cards) {
		cardsInPlay.victory_cards[card].qty = 8 + 4 * (numPlayers > 2);
	}

	// Pick ten random kingdom cards
	for (let i = 0; i < 10; i++) {
		cardsInPlay.kingdom_cards[shuffledNames[i]] = cards.kingdom_cards[shuffledNames[i]];
	}

	// Make player profiles and deal out starting decks
	for (let i = 0; i < numPlayers; i++) {
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
				player.cards.deck[i].name = 'copper';
			} else {
				player.cards.deck.push(cards.victory_cards.estate);
				player.cards.deck[i].name = 'estate';
			}
		}
	}

	function getCard(cardCategory, cardName) {
		if (cardsInPlay[cardCategory][cardName] > 0) {
			cardsInPlay[cardCategory][cardName].qty--;

			player.cards.discard.push(cardsInPlay[cardCategory][cardName]);
			player.cards.discard.name = cardName;
			return true
		} else {
			alert('There are no more cards in this stack');
			return false;
		}
	}

	test = cardsInPlay;
}

init();