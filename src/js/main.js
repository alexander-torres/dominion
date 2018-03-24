window.onload = init;

let game;

function init() {
	function Action(obj) {
		return function() {
			let isActionCard = this.getAttribute('category') === 'kingdom_cards';
			let player = game.activePlayer;

			if (player.actions > 0) {
				player.actions += (obj.actions || 0) - isActionCard;
				player.buys += obj.buys || 0;
				player.treasure += obj.treasure || 0;

				if (obj.gain) {
					player.gain.qty += obj.gain.qty || 0;
					player.gain.value = obj.gain.value || 0;
					player.gain.type = obj.gain.type || '';
				}

				for(let i = 0; i < obj.drawNum; i++) {
					player.checkDeck();

					printCards([player.cards.deck[0]], '#hand');

					drawCards(player.cards.deck, player.cards.hand, 1);
				}
			}
		}
	}

	function Cards() {
		let allCards = {
			kingdom_cards: {
				adventurer:		{qty: 10, cost: 6, action: new Action({})},
				bureaucrat:		{qty: 10, cost: 4, action: new Action({gain: {qty: 1, type: 'silver'}})},
				cellar: 		{qty: 10, cost: 2, action: new Action({actions: 1})},
				chancellor: 	{qty: 10, cost: 3, action: new Action({treasure: 2})},
				chapel: 		{qty: 10, cost: 2, action: new Action({})},
				council_room: 	{qty: 10, cost: 5, action: new Action({buys: 1, drawNum: 4})},
				feast:			{qty: 10, cost: 4, action: new Action({gain: {qty: 1, value: 5}})},
				festival: 		{qty: 10, cost: 5, action: new Action({actions: 2, buys: 1, treasure: 2})},
				gardens: 		{qty: 10, cost: 4, action: new Action({})},
				laboratory: 	{qty: 10, cost: 5, action: new Action({actions: 1, drawNum: 2})},
				library: 		{qty: 10, cost: 5, action: new Action({})},
				market: 		{qty: 10, cost: 5, action: new Action({actions: 1, buys: 1, drawNum: 1, treasure: 1})},
				militia: 		{qty: 10, cost: 4, action: new Action({treasure: 2})},
				mine:			{qty: 10, cost: 5, action: new Action({})},
				moat:			{qty: 10, cost: 2, action: new Action({drawNum: 2})},
				moneylender: 	{qty: 10, cost: 4, action: new Action({})},
				remodel: 		{qty: 10, cost: 4, action: new Action({})},
				smithy: 		{qty: 10, cost: 4, action: new Action({drawNum: 3})},
				spy:			{qty: 10, cost: 4, action: new Action({actions: 1, drawNum: 1})},
				thief:			{qty: 10, cost: 4, action: new Action({})},
				throne_room: 	{qty: 10, cost: 4, action: new Action({})},
				village: 		{qty: 10, cost: 3, action: new Action({actions: 2, drawNum: 1})},
				witch:			{qty: 10, cost: 5, action: new Action({drawNum: 2})},
				woodcutter:		{qty: 10, cost: 3, action: new Action({buys: 1, treasure: 2})},
				workshop:		{qty: 10, cost: 3, action: new Action({gain: {qty: 1, value: 4}})}
			},
			penalty_cards: {
				curse:			{qty: 30, victoryPoints: -1, action: new Action({})}
			},
			treasure_cards: {
				copper:			{qty: 60, cost: 0, value: 1, action: new Action({})},
				gold:			{qty: 30, cost: 6, value: 3, action: new Action({})},
				silver:			{qty: 40, cost: 3, value: 2, action: new Action({})}
			},
			victory_cards: {
				duchy:			{qty: 12, cost: 5, victoryPoints: 3, action: new Action({})},
				estate:			{qty: 24, cost: 2, victoryPoints: 1, action: new Action({})},
				province:		{qty: 12, cost: 8, victoryPoints: 6, action: new Action({})}
			}
	};

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
			func.apply(targetElement, params);
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

	function printCards(cardsInPlay, targetSelector, sortKey) {
		let target = document.querySelector(targetSelector);

		if (sortKey) {
			cardsInPlay = sortByKey(cardsInPlay, sortKey);
		}

		for (let card in cardsInPlay) {
			let img = document.createElement('img');

			img.alt = `${cardsInPlay[card].name} Cost: ${cardsInPlay[card].cost}`;
			img.className = 'card';
			img.name = cardsInPlay[card].name;
			img.setAttribute('category', cardsInPlay[card].category);
			img.src = `images/${cardsInPlay[card].name}.jpg`;

			target.append(img);

			if (targetSelector.search('#hand') >= 0) {
				addHandler(img, 'click', cardsInPlay[card].action);
			}
		}
	}

	// Data manipulation functions
	function checkCardCategory(cards, category) {
		let cardArray = (Array.isArray(cards) && cards) || [cards];
		let result = false;

		for (let i = 0; i < cardArray.length; i++) {
			result = result || cardArray[i].category === category;
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

	function sortByKey(arr, key) {
		arr = Object.values(arr);

		arr.sort(
			function(a, b) {
				let test = 0;

				if (a[key] < b[key]) {
					test = 1;
				} else if (a[key] > b[key]){
					test = -1;
				}

				return test;
			}
		);

		return arr;
	}

	function Player() {
		let thisPlayer = this;

		this.actions = 0;
		this.buys = 0;
		this.cards = {
			deck: [],
			discard: [],
			hand: [],
			played: []
		};
		this.gain = {
			qty: 0,
			type: '',
			value: 0
		};
		this.turnPhase = 'action';
		this.treasure = 0;

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
			let inActionPhase = thisPlayer.turnPhase === 'action';
			let inBuyPhase;
			let turnFinished = false;

			let canBuy;
			let canPlayAction = thisPlayer.actions > 0 && hasKingdomCards;

			if (!canPlayAction && inActionPhase) {
				thisPlayer.turnPhase = 'buy';
				thisPlayer.sumTreasure();
			}

			canBuy = thisPlayer.buys > 0 && hasTreasureCards;
			inBuyPhase = thisPlayer.turnPhase === 'buy';

			if (!canBuy && inBuyPhase) {
				turnFinished = true;
			}

			return turnFinished;
		};

		this.endTurn = function() {
			thisPlayer.turnPhase = 'action';
			thisPlayer.treasure = 0;
			thisPlayer.gain.qty = 0;
			thisPlayer.gain.type = '';
			thisPlayer.gain.value = 0;

			drawCards(thisPlayer.cards.hand, thisPlayer.cards.discard);

			eraseCards('#hand');
			printCards([{name: 'card_back'}], '#discard');
		};

		this.gainCard = function(cardPile) {
			let canAffordBuy = thisPlayer.buys > 0 && thisPlayer.treasure >= cardPile.cost;
			let canAffordGain = thisPlayer.gain.qty > 0 && thisPlayer.gain.value >= cardPile.cost;
			let correctCard = thisPlayer.gain.type === '' || thisPlayer.gain.type === cardPile.name;
			let inBuyPhase = thisPlayer.turnPhase === 'buy';
			let message = 'There are no more cards in this stack';

			let canBuyCard = inBuyPhase && canAffordBuy;
			let canGainCard = !inBuyPhase && correctCard && canAffordGain;

			if (cardPile.qty > 0) {
				if (canBuyCard || canGainCard) {
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
			thisPlayer.actions = 1;
			thisPlayer.buys = 1;
			thisPlayer.checkDeck();

			drawCards(thisPlayer.cards.deck, thisPlayer.cards.hand, 5);

			let text = 'Player hand for this turn:\n';
			for (let i = 0; i < 5; i++)
				text += thisPlayer.cards.hand[i].name + '\n';
			console.log(text);

			printCards(thisPlayer.cards.hand, '#hand');
		};

		this.sumTreasure = function() {
			for (let i = 0; i < thisPlayer.cards.hand.length; i++) {
				let isTreasure = thisPlayer.cards.hand[i].category === 'treasure_cards';

				thisPlayer.treasure += isTreasure && thisPlayer.cards.hand[i].value;
			}

			for (let i = 0; i < thisPlayer.cards.played.length; i++) {
				thisPlayer.treasure += thisPlayer.cards.played[i].value;
			}
		};
	}

	function Game() {
		let thisGame = this;

		this.activePlayer = {};
		this.cardsInPlay = {
			kingdom_cards: cards.kingdom_cards,
			treasure_cards: cards.treasure_cards,
			victory_cards: cards.victory_cards
		};
		this.numPlayers = 1;
		this.players = {};
		this.turn = 0;

		this.addListeners = function() {
			let gainableCards = document.querySelectorAll('#cardsInPlay .card');

			for (let i = 0; i < gainableCards.length; i++) {
				let category = gainableCards[i].parentElement.id;
				let name = gainableCards[i].name;

				addHandler(gainableCards[i], 'click', thisGame.activePlayer.gainCard, cards[category][name]);
			}
		};

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
			thisGame.activePlayer.endTurn();

			thisGame.turn++;

			thisGame.startPlayerTurn();
		};

		this.startPlayerTurn = function() {
			thisGame.activePlayer = thisGame.players[`player${thisGame.turn % thisGame.numPlayers + 1}`];

			thisGame.activePlayer.initTurn();

			thisGame.checkPlayerStatus();

			document.onclick =  thisGame.checkPlayerStatus;
		};

		(this.initGame = function() {
			thisGame.initPlayers(thisGame.numPlayers);

			// Clear board of all cards
			eraseCards();

			for (let card in cards.victory_cards) {
				cards.victory_cards[card].qty = 8 + 4 * (thisGame.numPlayers > 2);
			}

			// Print cards to board
			for (let category in thisGame.cardsInPlay) {
				printCards(cards[category], `#${category}`, 'cost');
			}

			thisGame.addListeners();

			printCards([{name: 'card_back'}], '#deck');

			// Begin gameplay
			thisGame.startPlayerTurn();
		})();
	}

	game = new Game();
}