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

	function Cards() {
		let allCards = {
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
	}

		function initCards() {
			allCards.kingdom_cards = shuffle(allCards.kingdom_cards, 10);

			for (let category in allCards) {
				for (let cardName in allCards[category]) {
					allCards[category][cardName].name = cardName;
					allCards[category][cardName].category = category;
				}
			}

			return allCards;
		}

		return initCards();
	}

	const cards = Cards();

	// DOM manipulation functions
	function addHandler(targetElement, event, func /*, arguments...*/) {
		let params = [];

		for (let i = 3; i < arguments.length; i++) {
			params.push(arguments[i]);
		}

		function handler() {
			func.apply(null, params);
		};

		targetElement.addEventListener(
			event,
			handler
		);

		return {element: targetElement, func: handler};
	}

	function eraseCards(targetSelector) {
		targetSelector = targetSelector || '';
		let cardElements = document.querySelectorAll(`${targetSelector} .card`);

		for (let i = 0; i < cardElements.length; i++) {
			cardElements[i].remove();
		}
	}

	function printCards(cardsInPlay, targetSelector) {
		let target = document.querySelector(targetSelector);

		for (let card in cardsInPlay) {
			let img = document.createElement('img');

			img.alt = cardsInPlay[card].name;
			img.className = 'card';
			img.name = cardsInPlay[card].name;
			img.src = `../images/${cardsInPlay[card].name}.jpg`;

			target.append(img);
		}
	}

	// Data manipulation functions
	function checkCardCategory(cards, category) {
		let cardArray = (Array.isArray(cards) && cards) || [cards];
		let result = false;

		for (let i = 0; i < cardArray.length; i++) {
			result = result || cardArray[i].category == category;
		}

		return result;
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

	function shuffle(deck, num) {
		let shuffled = {
			arr: [],
			obj: {}
		};
		let toShuffle = [];

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

	function Player() {
		let thisPlayer = this;
		this.actions = 0;
		this.buys = 0;
		this.cards = {
			deck: [],
			discard: [],
			hand: []
		};
		this.gain = {
			qty: 0,
			value: 0
		};
		this.listeners = [];
		this.turnPhase = 'action';
		this.treasure = 0;

		this.addListeners = function() {
			let gainableCards = document.querySelectorAll('#cardsInPlay .card');

			for (let i = 0; i < gainableCards.length; i++) {
				let category = gainableCards[i].parentElement.id;
				let name = gainableCards[i].name;

				thisPlayer.listeners.push(
					addHandler(gainableCards[i], 'click', thisPlayer.gainCard, cards[category][name])
				);
			}
		};

		this.checkDeck = function() {
			if (thisPlayer.cards.deck.length < 5) {
				thisPlayer.cards.discard = shuffle(thisPlayer.cards.discard);

				drawCards(thisPlayer.cards.discard, thisPlayer.cards.deck);

				eraseCards('#discard');
			}
		};

		this.checkStatus = function() {
			let hasKingdomCards = checkCardCategory(thisPlayer.cards.hand, 'kingdom_cards');
			let hasTreasureCards = checkCardCategory(thisPlayer.cards.hand, 'treasure_cards');
			let turnFinished = false;

			let canPlayAction = thisPlayer.turnPhase === 'action' && thisPlayer.actions > 0 && hasKingdomCards;

			if (!canPlayAction) {
				thisPlayer.turnPhase = 'buy';
			}

			let canBuy = thisPlayer.turnPhase === 'buy' && thisPlayer.buys > 0 && hasTreasureCards;

			if (!canBuy) {
				turnFinished = true;
			}

			return turnFinished;
		};

		this.endTurn = function() {
			thisPlayer.turnPhase = 'action';

			for (let i = 0; i < thisPlayer.listeners.length; i++) {
				thisPlayer.listeners[i].element.removeEventListener('click', thisPlayer.listeners[i].func);
			}

			drawCards(thisPlayer.cards.hand, thisPlayer.cards.discard);

			eraseCards('#hand');
			printCards([{name: 'card_back'}], '#discard');
		};

		this.gainCard = function(cardPile) {
			let canAffordBuy = thisPlayer.buys > 0 && thisPlayer.treasure >= cardPile.cost;
			let canAffordGain = thisPlayer.gain.qty > 0 && thisPlayer.gain.value >= cardPile.cost;
			let inBuyPhase = thisPlayer.turnPhase === 'buy';
			let message = 'There are no more cards in this stack';

			let canBuy = inBuyPhase && canAffordBuy;
			let canGain = !inBuyPhase && canAffordGain;

			if (cardPile.qty > 0) {
				if (canBuy || canGain) {
					drawCards(cardPile, thisPlayer.cards.discard, 1);

					thisPlayer.buys -= inBuyPhase;
					thisPlayer.gain.qty -= !inBuyPhase;

					thisPlayer.treasure -= inBuyPhase * cardPile.cost;
				} else {
					message = inBuyPhase && `YOU HAVE\nBuys: ${thisPlayer.buys}\nTreasure: ${thisPlayer.treasure}`;
					message = message || 'You cannot gain a card';

					alert(message);
				}
				return;
			}

			alert(message);
		};

		(this.initPlayer = function() {
			drawCards(cards.treasure_cards.copper, thisPlayer.cards.deck, 7);
			drawCards(cards.victory_cards.estate, thisPlayer.cards.deck, 3);

			thisPlayer.cards.deck = shuffle(thisPlayer.cards.deck);
		})();

		this.initTurn = function() {
			thisPlayer.actions++;
			thisPlayer.buys++;
			thisPlayer.checkDeck();

			drawCards(thisPlayer.cards.deck, thisPlayer.cards.hand, 5);

			printCards(thisPlayer.cards.hand, '#hand');

			thisPlayer.addListeners();
		};
	}

	function Game() {
		let thisGame = this;
		this.cardsInPlay = {
			kingdom_cards: cards.kingdom_cards,
			treasure_cards: cards.treasure_cards,
			victory_cards: cards.victory_cards
		};
		this.listeners = [];
		this.numPlayers = 1;
		this.players = {};
		this.turn = 1;

		this.checkPlayerStatus = function() {
			let turnFinished = thisGame.activePlayer.checkStatus();

			if (turnFinished) {
				thisGame.nextPlayer();
			}
		};

		this.initPlayers = function(num) {
			for (let i = 1; i <= num; i++) {
				thisGame.players['player' + i] = new Player();
			}

			thisGame.activePlayer = thisGame.players.player1;
		};

		this.nextPlayer = function() {
			for (let i = 0; i < thisGame.listeners.length; i++) {
				document.removeEventListener('click', thisGame.listeners[i].func);
			}

			thisGame.activePlayer.endTurn();

			thisGame.turn++;

			thisGame.startPlayerTurn();
		};

		this.startPlayerTurn = function() {
			thisGame.activePlayer = thisGame.players[`player${thisGame.turn % thisGame.numPlayers + 1}`];

			thisGame.activePlayer.initTurn();

			thisGame.checkPlayerStatus();

			thisGame.listeners.push(addHandler(document, 'click', thisGame.checkPlayerStatus));
		};

		(this.initGame = function() {
			thisGame.initPlayers(thisGame.numPlayers);

			// Clear board of all cards
			eraseCards();

			for (let card in cards.victory_cards) {
				cards.victory_cards[card].qty = 8 + 4 * (thisGame.numPlayers > 2);
			}

			for (let category in thisGame.cardsInPlay) {
				printCards(cards[category], `#${category}`);
			}

			printCards([{name: 'card_back'}], '#deck');

			thisGame.startPlayerTurn();
		})();
	}

	game = new Game();
}