var g = document.getElementById("main");
var parr = [];
parr.push(Object.assign({}, window.playerClass));
parr.push(Object.assign({}, window.playerClass));
parr[1].velX = 5;
parr[1].mass = 5;
parr[0].mass = 5;
parr[0].posY = 90;
parr[0].moves = [{
  eventListener: "keydown",
	moveFunct: function(e, moveInterface) {
    if(e.key == "w" && !e.repeat) {
      moveInterface.cvelY = 10;
    }
    if(e.key == "e" && !e.repeat) {
      moveInterface.cposX += 100 * moveInterface.testVar2;
    }
    if(e.key == "g" && !e.repeat) {
      var tempInput = {
        width: 128,
        height: 10,
        energy: 20,
        startup: 15,
        duration: 3,
        recovery: 3,

        posX: 16,
        posY: 7.5,
        velX: 0,
        velY: 0,
        orgX: 0,
        orgY: 10
      };
      tempInput.orgX = tempInput.width + 50;
      if(moveInterface.testVar2 < 0) {
        tempInput.posX -= tempInput.width + 16;
        tempInput.orgX = -50;
      }
      moveInterface.createHit = tempInput;
    }
    if(e.key == "h" && !e.repeat) {
      var tempInput = {
        width: 32,
        height: 24,
        energy: 30,
        startup: 3,
        duration: 3,
        recovery: 4,

        posX: 16,
        posY: 4,
        velX: 0,
        velY: 0,
        orgX: 0,
        orgY: 0
      };
      if(moveInterface.testVar2 < 0) {
        tempInput.posX -= tempInput.width + 16;
        tempInput.orgX = tempInput.width;
      }
      moveInterface.createHit = tempInput;
    }
    if(e.key == "j" && !e.repeat) {
      var tempInput = {
        width: 15,
        height: 2,
        energy: 30,
        startup: 5,
        duration: 40,
        recovery: 25,

        posX: 0,
        posY: 16,
        velX: 7,
        velY: 0,
        orgX: -25,
        orgY: 1
      };
      if(moveInterface.testVar2 < 0) {
        tempInput.velX = -7;
        tempInput.orgX = tempInput.width + 25;
      }
      moveInterface.createHit = tempInput;
    }
	}
},
{
  eventListener: "tick",
  moveFunct: function(e, moveInterface) {
    moveInterface.testVar1 = 0;
    if(isNaN(moveInterface.testVar2)) {
      moveInterface.testVar2 = 1;
    }
    /*
    for(var i = 0;i < moveInterface.hitArr.length;i++) {
      if(moveInterface.hitArr[i].playerId == moveInterface.playerId) {
        moveInterface.testVar1 = 1;
      }
    }
    */
    if(e.detail[65] && !e.detail[68] && moveInterface.testVar1 == 0) {
      if(moveInterface.gvelX > -4.5) {
        moveInterface.cvelX = -0.75;
        moveInterface.testVar2 = -1;
      }
    }
    if(e.detail[68] && !e.detail[65] && moveInterface.testVar1 == 0) {
      if(moveInterface.gvelX < 4.5) {
        moveInterface.cvelX = 0.75;
        moveInterface.testVar2 = 1;
      }
    }
    if(e.detail[32]) {
      moveInterface.cvelY += 0.66;
    }
    if(e.detail[82]) {
      var tempInput = {
        width: 12,
        height: 48,
        energy: 10,
        startup: 0,
        duration: 1,
        recovery: 0,

        posX: 16,
        posY: -5,
        velX: 0,
        velY: 0,
        orgX: 0,
        orgY: 24
      };
      if(moveInterface.testVar2 < 0) {
        tempInput.posX -= tempInput.width + 16;
        tempInput.orgX = tempInput.width;
      }
      if(JSON.stringify(moveInterface.createHit) == "{}") {
        moveInterface.createHit = tempInput;
      }
    }
  }
}];
parr[1].moves = [{
  eventListener: "keydown",
	moveFunct: function(e, moveInterface) {
    if(e.key == "i" && !e.repeat) {
      moveInterface.cvelY = 10;
    }
    if(e.key == "k" && !e.repeat) {
      var tempInput = {
        width: 32,
        height: 24,
        energy: 30,
        startup: 3,
        duration: 3,
        recovery: 4,

        posX: 16,
        posY: 4,
        velX: 0,
        velY: 0,
        orgX: 0,
        orgY: 0
      };
      if(moveInterface.testVar2 < 0) {
        tempInput.posX -= tempInput.width + 16;
        tempInput.orgX = tempInput.width;
      }
      moveInterface.createHit = tempInput;
    }
    if(e.key == "l" && !e.repeat) {
      var tempInput = {
        width: 15,
        height: 2,
        energy: 30,
        startup: 5,
        duration: 40,
        recovery: 25,

        posX: 0,
        posY: 16,
        velX: 7,
        velY: 0,
        orgX: -25,
        orgY: 1
      };
      if(moveInterface.testVar2 < 0) {
        tempInput.velX = -7;
        tempInput.orgX = tempInput.width + 25;
      }
      moveInterface.createHit = tempInput;
    }
	}
},
{
  eventListener: "tick",
  moveFunct: function(e, moveInterface) {
    moveInterface.testVar1 = 0;
    if(isNaN(moveInterface.testVar2)) {
      moveInterface.testVar2 = 1;
    }
    /*
    for(var i = 0;i < moveInterface.hitArr.length;i++) {
      if(moveInterface.hitArr[i].playerId == moveInterface.playerId) {
        moveInterface.testVar1 = 1;
      }
    }
    */
    if(e.detail[78] && !e.detail[77] && moveInterface.testVar1 == 0) {
      if(moveInterface.gvelX > -4.5) {
        moveInterface.cvelX = -0.75;
        moveInterface.testVar2 = -1;
      }
    }
    if(e.detail[77] && !e.detail[78] && moveInterface.testVar1 == 0) {
      if(moveInterface.gvelX < 4.5) {
        moveInterface.cvelX = 0.75;
        moveInterface.testVar2 = 1;
      }
    }
  }
}];
var game = Object.assign({}, window.gameClass);
game.playerArr = parr;
game.initFunct();

setInterval(function(){
  game.updateFunct();
  game.drawFunct(g);
},1000/60);
