window.onload = init;

function init() {
	function Card(qty, cost, value, victoryPoints, action) {
		this.qty = qty;
		this.cost = cost;
		this.value = value;
		this.victoryPoints = victoryPoints;
		this.action = action;
	}

	const cards = {
		copper: new Card(60, 0, 1, 0),
		silver: new Card(40, 3, 2, 0),
		gold: new Card(30, 6, 3, 0),
		estate: new Card(24, 2, 0, 1),
		duchy: new Card(12, 5, 0, 3),
		province: new Card(12, 8, 0, 6),
		curse: new Card(30, 0, 0, -1),
		gardens: new Card(12, 4,)
		adventurer: new Card(10),
		bureaucrat: new Card(10),
		cellar: new Card(10),
		chancellor: new Card(10),
		chapel: new Card(10),
		council_room: new Card(10),
		feast: new Card(10),
		festival: new Card(10),
		laboratory: new Card(10),
		library: new Card(10),
		market: new Card(10),
		militia: new Card(10),
		mine: new Card(10),
		moat: new Card(10),
		moneylender: new Card(10),
		remodel: new Card(10),
		smithy: new Card(10),
		spy: new Card(10),
		thief: new Card(10),
		throne_room: new Card(10),
		village: new Card(10),
		witch: new Card(10),
		woodcutter: new Card(10),
		workshop: new Card(10)
	};

	console.log(cards);
}