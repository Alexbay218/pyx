var g = document.getElementById("main");
var parr = [];
parr.push(Object.assign({}, window.playerClass));
parr[0].posY = 90;
parr[0].velX = 2;
parr[0].moves = [{
  eventListener: "keypress",
	moveFunc: function(e, moveInterface) {
    if(e.key == "a") {
      moveInterface.cvelY = 5;
    }
	}
}];
var game = Object.assign({}, window.gameClass);
console.log(game);
game.playerArr = parr;
game.initFunc();

setInterval(function(){
  game.updateFunct();
  game.drawFunct(g);
},10);
