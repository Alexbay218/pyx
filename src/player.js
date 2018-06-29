var playerClass = {
	name: "default",
	width: 16,
	height: 32,
	mass: 1,
	maxspeed: 10,
	maxhitpoint: 100,
	maxenergy: 100,
	energyrate: 5,

	playerid: 0,
	posX: 0,
	posY: 0,
	velX: 0,
	velY: 0,
	energy: 100,
	hitpoint: 100,
	moveInterface: {
		cposX: 0,
		cposY: 0,
		cvelX: 0,
		cvelY: 0
	}, //moveInterface object that contains changeable values

	moves: [] //list of move objects
	};
