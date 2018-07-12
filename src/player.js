var playerClass = {
	name: "default",
	width: 16,
	height: 32,
	mass: 1,
	maxHitPoint: 1000,
	hitPointRate: 0.33,
	maxEnergy: 300,
	energyRate: 3,

	playerId: 0,
	posX: 0,
	posY: 0,
	velX: 0,
	velY: 0,
	energy: 300,
	hitPoint: 1000,
	stunticks: 0,

	moveInterface: {}, //moveInterface object that contains changeable values
	moves: [] //list of move objects
};
