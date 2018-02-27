window.onload = init;

let game;

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

	// Utility functions
	function addHandler(targetElement, event, func /*, arguments...*/) {
		let params = [];

		for (let i = 3; i < arguments.length; i++) {
			params.push(arguments[i]);
		}

		targetElement.addEventListener(
			event,
			function() {
				func.apply(null, params);
			}
		);
	}

	function drawCards(fromCardPile, toCardPile, num) {
		num = num || fromCardPile.length;

		for (let i = 0; i < num; i++) {
			if (Array.isArray(fromCardPile)) {
				toCardPile.push(fromCardPile.pop());
			}

			else {
				toCardPile.push(fromCardPile);
				fromCardPile.qty--;
			}
		}
	}

	function printCards(cards, targetSelector) {
		let target = document.querySelector(targetSelector);

		for (let card in cards) {
			let img = document.createElement('img');

			img.alt = cards[card].name;
			img.className = 'card';
			img.name = cards[card].name;
			img.src = `../images/${cards[card].name}.jpg`;

			target.append(img);
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

	// General functions
	function addBuyListeners() {
		let buyableCards = document.querySelectorAll('#cardsInPlay .card');

		for (let i = 0; i < buyableCards.length; i++) {
			let cardCategory = buyableCards[i].parentElement.id;
			let cardName = buyableCards[i].name;
			let player = this.activePlayer;

			addHandler(buyableCards[i], 'click', buyCard, cardCategory, cardName, player);
		}
	}

	function buyCard(cardCategory, cardName, player) {
		if (game.cardsInPlay[cardCategory][cardName].qty > 0) {
			drawCards(game.cardsInPlay[cardCategory][cardName], player.cards.discard, 1);

			return true;
		}

		alert('There are no more cards in this stack');
	}

	function dealPlayerCards(player) {
		drawCards(cards.treasure_cards.copper, player.cards.deck, 7);
		drawCards(cards.victory_cards.estate, player.cards.deck, 3);

		player.cards.deck = shuffle(player.cards.deck);
	}

	function eraseCards(targetSelector) {
		targetSelector = targetSelector || '';
		let cards = document.querySelectorAll(`${targetSelector} .card`);

		for (let i = 0; i < cards.length; i++) {
			cards[i].remove();
		}
	}

	function preventOverdraw(player) {
		if (player.cards.deck.length < 5) {
			player.cards.discard = shuffle(player.cards.discard);

			drawCards(player.cards.discard, player.cards.deck);

			eraseCards('#deck');
		}
	}

	function Game() {
		let thisGame = this;
		this.cardsInPlay = {
			kingdom_cards: shuffle(cards.kingdom_cards, 10),
			treasure_cards: cards.treasure_cards,
			victory_cards: cards.victory_cards
		};
		this.numPlayers = 2;
		this.players = {};
		this.turn = 0;

		this.addPlayers = function(num) {
			for (let i = 1; i <= num; i++) {
				thisGame.players['player' + i] = {
					actions: 0,
					cards: {
						deck: [],
						discard: [],
						hand: []
					},
					treasure: 0
				};

				dealPlayerCards(thisGame.players['player' + i]);
			}
		};

		this.playerTurn = function() {
			thisGame.turn = thisGame.turn++ % thisGame.numPlayers + 1;

			thisGame.activePlayer = thisGame.players[`player${thisGame.turn}`];

			preventOverdraw(thisGame.activePlayer);

			drawCards(thisGame.activePlayer.cards.deck, thisGame.activePlayer.cards.hand, 5);

			printCards(thisGame.activePlayer.cards.hand, '#hand');
		};

		(this.startGame = function() {
			thisGame.addPlayers(thisGame.numPlayers);

			eraseCards();

			for (let card in thisGame.cardsInPlay.victory_cards) {
				thisGame.cardsInPlay.victory_cards[card].qty = 8 + 4 * (thisGame.numPlayers > 2);
			}

			for (let cardCategory in thisGame.cardsInPlay) {
				printCards(thisGame.cardsInPlay[cardCategory], `#${cardCategory}`);
			}

			addBuyListeners.call(thisGame);

			printCards([{name: 'card_back'}], '#deck');

			thisGame.playerTurn();
		})();
	}

	game = new Game();
}