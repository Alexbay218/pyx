var gameClass = {
  currTick: 0,
  currTime: 0,

  arenaWidth: 800,
  arenaHeight: 500,
  arenaBounce: 0.55,
  arenaDrag: 0.000175,

  playerArr: [],
  hitArr: [],
  keyArr: [],
  tickEvent: {},

  initFunct: function (){
    currTick = 0;
    currTime = new Date().getTime();
    for(var i = 0;i < this.playerArr.length;i++) {
      this.playerArr[i].playerId = i;
      this.playerArr[i].moveInterface = {
    		playerId: 0,
    		cposX: 0,
    		cposY: 0,
    		cvelX: 0,
    		cvelY: 0,
    		gposX: 0,
    		gposY: 0,
    		gvelX: 0,
    		gvelY: 0,
    		currTick: 0,
    		hitArr: [],
        createHit: {}
    	};
      for(var j = 0;j < this.playerArr[i].moves.length;j++) {
        var tempFunct = Function("e","this.game.playerArr[" + i + "].moves[" + j + "].moveFunct(e,this.game.playerArr[" + i + "].moveInterface);");
        //the above line refers to the global game object in main and not this instance of gameClass. Not a good solution, but its a stopgate solution
        window.addEventListener(this.playerArr[i].moves[j].eventListener,tempFunct);
      }
    }
    var keys = this.keyArr;
    window.addEventListener("keydown",
        function(e){
            keys[e.keyCode] = true;
        },
    false);

    window.addEventListener("keyup",
        function(e){
            keys[e.keyCode] = false;
        },
    false);

    this.tickEvent = new CustomEvent("tick", {detail: this.keyArr});
  },
  updateFunct: function () {
    this.currTick++;
    this.keyArr[0] = this.currTick;
    for(var i = 0;i < this.playerArr.length;i++) { //Update hitPoint, energy, and stunticks
      this.playerArr[i].hitPoint += this.playerArr[i].hitPointRate;
      this.playerArr[i].energy += this.playerArr[i].energyRate;
      if(this.playerArr[i].hitPoint > this.playerArr[i].maxHitPoint) {
        this.playerArr[i].hitPoint = this.playerArr[i].maxHitPoint;
      }
      if(this.playerArr[i].energy > this.playerArr[i].maxEnergy) {
        this.playerArr[i].energy = this.playerArr[i].maxEnergy;
      }
      if(this.playerArr[i].stunticks > 0) {
        this.playerArr[i].stunticks--;
      }
      else {
        this.playerArr[i].stunticks = 0;
      }
    }
    for(var i = 0;i < this.hitArr.length;i++) { //Update Hit Duration
      if(this.currTick >= this.hitArr[i].startTick + this.hitArr[i].startup + this.hitArr[i].duration + this.hitArr[i].recovery) {
        this.hitArr.splice(i, 1);
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player Velocities (Gravity and Horizontal Air Resistance)
      this.playerArr[i].velY -= 0.5;
      this.playerArr[i].velX += ((-this.playerArr[i].velX)*this.arenaDrag*this.playerArr[i].height)/(this.playerArr[i].mass*0.01);
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update the move interface object with current velocities
      this.playerArr[i].moveInterface.gposY = this.playerArr[i].posY;
      this.playerArr[i].moveInterface.gposX = this.playerArr[i].posX;
      this.playerArr[i].moveInterface.gvelY = this.playerArr[i].velY;
      this.playerArr[i].moveInterface.gvelX = this.playerArr[i].velX;
      this.playerArr[i].moveInterface.playerId = this.playerArr[i].playerId;
      this.playerArr[i].moveInterface.currTick = Number(this.currTick.toString());
      this.playerArr[i].moveInterface.hitArr = this.hitArr;
    }
    window.dispatchEvent(this.tickEvent); //Run tick events
    for(var i = 0;i < this.playerArr.length;i++) { //Create Hits
      var hasHit = false;
      for(var j = 0;j < this.hitArr.length;j++) {
        if(this.playerArr[i].playerId == this.hitArr[j].playerId) {
          hasHit = true;
        }
      }
      if(hasHit == false && JSON.stringify(this.playerArr[i].moveInterface.createHit) != "{}" && this.playerArr[i].stunticks <= 0) {
        var temp = Object.assign({}, window.hitClass);
        temp.playerId = this.playerArr[i].playerId;
        temp.posY = (this.playerArr[i].posY - this.playerArr[i].moveInterface.createHit.posY);
        temp.posX = (this.playerArr[i].posX + this.playerArr[i].moveInterface.createHit.posX);
        temp.velX = this.playerArr[i].moveInterface.createHit.velX;
        temp.velY = this.playerArr[i].moveInterface.createHit.velY;
        temp.orgX = this.playerArr[i].moveInterface.createHit.orgX;
        temp.orgY = this.playerArr[i].moveInterface.createHit.orgY;
        temp.width = this.playerArr[i].moveInterface.createHit.width;
        temp.height = this.playerArr[i].moveInterface.createHit.height;
        temp.energy = this.playerArr[i].moveInterface.createHit.energy;
        temp.startup = Math.abs(this.playerArr[i].moveInterface.createHit.startup);
        temp.duration = Math.abs(this.playerArr[i].moveInterface.createHit.duration);
        temp.recovery = Math.abs(this.playerArr[i].moveInterface.createHit.recovery);
        temp.startTick = this.currTick;
        var energycost = 0;
        energycost += Math.abs(temp.energy);
        energycost += Math.abs(temp.width)*Math.abs(temp.height)*0.125;
        energycost += Math.sqrt(Math.pow(this.playerArr[i].moveInterface.createHit.posY,2)+Math.pow(this.playerArr[i].moveInterface.createHit.posY,2));
        energycost += Math.sqrt(Math.pow(this.playerArr[i].moveInterface.createHit.velY,2)+Math.pow(this.playerArr[i].moveInterface.createHit.velY,2));
        energycost = energycost * ((temp.duration-0.75)/(temp.startup*0.5+Math.pow((temp.duration-0.65),-1.5)+temp.recovery*0.5));
        console.log(energycost)
        if(this.playerArr[i].energy >= energycost) {
          this.playerArr[i].energy -= energycost;
          this.hitArr.push(Object.assign({}, temp));
        }
      }
      this.playerArr[i].moveInterface.createHit = {};
    }
    for(var i = 0;i < this.hitArr.length;i++) {
      for(var j = 0;j < this.hitArr.length;j++) {
        if(this.hitArr[i].playerId != this.hitArr[j].playerId) {
          if(this.intersectFunct(
            this.hitArr[i].posX,
            this.hitArr[i].posY,
            this.hitArr[i].width,
            this.hitArr[i].height,
            this.hitArr[j].posX,
            this.hitArr[j].posY,
            this.hitArr[j].width,
            this.hitArr[j].height
          )) {
            if(this.hitArr[i].energy > this.hitArr[j].energy) {
              this.hitArr[i].energy -= this.hitArr[j].energy * 1.5;
              this.hitArr[j].energy = 0;
            }
            else if(this.hitArr[i].energy < this.hitArr[j].energy) {
              this.hitArr[j].energy -= this.hitArr[i].energy * 1.5;
              this.hitArr[i].energy = 0;
            }
            else {
              this.hitArr[j].energy = 0;
              this.hitArr[i].energy = 0;
            }
          }
        }
      }
    }
    for(var i = 0;i < this.hitArr.length;i++) { //Delete hits that doesn't have energy
      if(this.hitArr[i].energy <= 0) {
        this.hitArr.splice(i, 1);
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player Velocities (Arena Collisions)
      if(this.playerArr[i].posY > this.arenaHeight) {
        if(((Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass) > 0.5) {
          this.playerArr[i].hitPoint -= 15*((Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass);
        }
        this.playerArr[i].velY = (Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posY = this.arenaHeight;
      }
      if(this.playerArr[i].posY-this.playerArr[i].height < 0) {
        if(((Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass) > 0.5) {
          this.playerArr[i].hitPoint -= 15*((Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass);
        }
        this.playerArr[i].velY = -(Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posY = this.playerArr[i].height;
      }
      if(this.playerArr[i].posX+this.playerArr[i].width > this.arenaWidth) {
        if(((Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass) > 0.5) {
          this.playerArr[i].hitPoint -= 15*((Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass);
        }
        this.playerArr[i].velX = -(Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posX = this.arenaWidth-this.playerArr[i].width;
      }
      if(this.playerArr[i].posX < 0) {
        if(((Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass) > 0.5) {
          this.playerArr[i].hitPoint -= 15*((Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass);
        }
        this.playerArr[i].velX = (Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posX = 0;
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player on Hit Collisions
      for(var j = 0;j < this.hitArr.length;j++) {
        if(this.playerArr[i].playerId != this.hitArr[j].playerId) {
          if(this.intersectFunct(
            this.playerArr[i].posX,
            this.playerArr[i].posY,
            this.playerArr[i].width,
            this.playerArr[i].height,
            this.hitArr[j].posX,
            this.hitArr[j].posY,
            this.hitArr[j].width,
            this.hitArr[j].height
          )) {
            if(this.currTick <= this.hitArr[j].startTick + this.hitArr[j].startup + this.hitArr[j].duration && this.currTick >= this.hitArr[j].startTick + this.hitArr[j].startup) {
              var multiply = (this.hitArr[j].energy)/(this.playerArr[i].mass*0.5);
              this.playerArr[i].stunticks = multiply*1.25;
              this.playerArr[i].hitPoint -= multiply*3;
              if(this.playerArr[i].posX + (this.playerArr[i].width/2) == this.hitArr[j].posX + (this.hitArr[j].width/2)) {
                this.playerArr[i].velY = multiply;
              }
              else {
                var angle = Math.atan(
                  ((this.hitArr[j].posY - this.hitArr[j].orgY) - (this.playerArr[i].posY - (this.playerArr[i].height/2)))/
                  ((this.playerArr[i].posX + (this.playerArr[i].width/2)) - (this.hitArr[j].posX + (this.hitArr[j].orgX)))
                );
                if(((this.playerArr[i].posX + (this.playerArr[i].width/2)) - (this.hitArr[j].posX + (this.hitArr[j].orgX))) < 0) {
                  angle += Math.PI;
                }
                this.playerArr[i].velX = Math.cos(angle) * multiply;
                this.playerArr[i].velY = Math.sin(angle) * multiply;
              }
              this.hitArr[j].startTick = this.currTick - this.hitArr[j].startup - this.hitArr[j].duration;
            }
          }
        }
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player on Player Collisions
      for(var j = 0;j < this.playerArr.length;j++) {
        if(this.playerArr[i].playerId != this.playerArr[j].playerId) {
          if(this.intersectFunct(
            this.playerArr[i].posX,
            this.playerArr[i].posY,
            this.playerArr[i].width,
            this.playerArr[i].height,
            this.playerArr[j].posX,
            this.playerArr[j].posY,
            this.playerArr[j].width,
            this.playerArr[j].height
          )) {
            var multiply = 4*(Math.abs(this.playerArr[i].velY + this.playerArr[i].velX) + Math.abs(this.playerArr[j].velY + this.playerArr[j].velX))/(this.playerArr[i].mass);
            if(this.playerArr[i].posX + (this.playerArr[i].width/2) == this.playerArr[j].posX + (this.playerArr[j].width/2)) {
              this.playerArr[i].velY = multiply;
            }
            else {
              var angle = Math.atan(
                (-(this.playerArr[i].posY - (this.playerArr[i].height/2)) - (this.playerArr[j].posY - (this.playerArr[j].height/2)))/
                -((this.playerArr[i].posX + (this.playerArr[i].width/2)) - (this.playerArr[j].posX + (this.playerArr[j].width/2))));
              this.playerArr[i].velX = Math.sin(angle) * multiply;
              this.playerArr[i].velY = Math.cos(angle) * multiply;
            }
            if(multiply > 5) {
              this.playerArr[i].hitPoint -= multiply*(this.playerArr[i].mass)*0.33;
              this.playerArr[j].hitPoint -= multiply*(this.playerArr[i].mass)*0.33;
            }
          }
        }
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player Pos and Vel from player move interface object
      if(this.playerArr[i].stunticks <= 0) {
        var energycost = 0;
        var hasValue = false;
        if(Math.sqrt(Math.pow(this.playerArr[i].moveInterface.cposY,2) + Math.pow(this.playerArr[i].moveInterface.cposX,2)) > 0) {
          energycost += Math.sqrt(Math.pow(this.playerArr[i].moveInterface.cposY,2) + Math.pow(this.playerArr[i].moveInterface.cposX,2)) * 0.66;
          hasValue = true;
        }
        var velChange = (
        (1.33* Math.abs(Math.pow(this.playerArr[i].moveInterface.gvelY,2) - Math.pow(this.playerArr[i].moveInterface.cvelY+this.playerArr[i].moveInterface.gvelY,2))) +
        Math.abs(Math.pow(this.playerArr[i].moveInterface.gvelX,2) - Math.pow(this.playerArr[i].moveInterface.cvelX+this.playerArr[i].moveInterface.gvelX,2))
        );
        if(velChange > 0) {
          energycost += 0.0775 * (this.playerArr[i].mass) * velChange;
          hasValue = true;
        }
        if(this.playerArr[i].energy >= energycost && hasValue == true) {
          this.playerArr[i].posY += this.playerArr[i].moveInterface.cposY;
          this.playerArr[i].posX += this.playerArr[i].moveInterface.cposX;
          this.playerArr[i].velY += this.playerArr[i].moveInterface.cvelY;
          this.playerArr[i].velX += this.playerArr[i].moveInterface.cvelX;
          this.playerArr[i].energy -= energycost;
        }
        this.playerArr[i].moveInterface.cposY = 0;
        this.playerArr[i].moveInterface.cposX = 0;
        this.playerArr[i].moveInterface.cvelY = 0;
        this.playerArr[i].moveInterface.cvelX = 0;
      }
    }
    for(var i = 0;i < this.hitArr.length;i++) { //Actually moving the hits
      this.hitArr[i].posY -= this.hitArr[i].velY;
      this.hitArr[i].posX += this.hitArr[i].velX;
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Actually moving the players
      this.playerArr[i].posY -= this.playerArr[i].velY;
      this.playerArr[i].posX += this.playerArr[i].velX;
    }
  },
  drawFunct: function (g){
    var gx = g.getContext("2d");

    gx.clearRect(0,0,g.width,g.height);
    g.width = Math.floor(document.body.scrollWidth);
    g.height = Math.floor(document.body.scrollHeight);

    gx.fillStyle = "#FFFFFF";
    var newX = ((g.width/2)-(this.arenaWidth/2));
    var newY = ((g.height/2)-(this.arenaWidth/2));
    gx.fillRect(newX,newY,this.arenaWidth,this.arenaHeight);
    for(var i = 0;i < this.hitArr.length;i++) { //Draw hits
      if(this.currTick < this.hitArr[i].startTick + this.hitArr[i].startup) {
        gx.fillStyle = "#FF0000";
      }
      else if(this.currTick <= this.hitArr[i].startTick + this.hitArr[i].startup + this.hitArr[i].duration) {
        gx.fillStyle = "#FFFF00";
      }
      else {
        gx.fillStyle = "#00FF00";
      }
      gx.fillRect(newX+this.hitArr[i].posX,newY+(this.hitArr[i].posY-this.hitArr[i].height),this.hitArr[i].width,this.hitArr[i].height);
      gx.fillStyle = "#00FFFF";
      //gx.arc((this.hitArr[i].posX + (this.hitArr[i].orgX)),(this.hitArr[i].posY - this.hitArr[i].orgY),5,0,2*Math.PI);
      gx.strokeStyle = "#000000";
      gx.lineWidth = 0;
      gx.beginPath();
      gx.arc((newX + this.hitArr[i].posX + (this.hitArr[i].orgX)),(newY + this.hitArr[i].posY - this.hitArr[i].orgY),5,0,2*Math.PI);
      gx.closePath();
      gx.lineWidth = 0;
      gx.fill();
    }

    gx.fillStyle = "#0000FF";
    for(var i = 0;i < this.playerArr.length;i++) { //Draw players
      if(this.playerArr[i].stunticks > 0) {
        gx.fillStyle = "#FF0000";
      }
      else {
        gx.fillStyle = "#0000FF";
      }
      gx.fillRect(newX+this.playerArr[i].posX,newY+(this.playerArr[i].posY-this.playerArr[i].height),this.playerArr[i].width,this.playerArr[i].height);
      gx.strokeStyle = "#FF0000";
      gx.lineWidth = 5;
      gx.beginPath();
      gx.moveTo(newX+this.playerArr[i].posX+(this.playerArr[i].width/2),newY+(this.playerArr[i].posY-(this.playerArr[i].height/2)));
      gx.lineTo(newX+this.playerArr[i].posX+(this.playerArr[i].width/2)+3*this.playerArr[i].velX,newY+(this.playerArr[i].posY-(this.playerArr[i].height/2))-3*this.playerArr[i].velY);
      gx.closePath();
      gx.stroke();
      gx.fillStyle = "#000000";
      gx.font = "15px Arial"
      gx.fillText("Player " + (this.playerArr[i].playerId+1), newX+this.playerArr[i].posX-20, newY+this.playerArr[i].posY-6-this.playerArr[i].height)
      gx.fillStyle = "#FFFFFF";
      gx.fillRect(35,15+this.playerArr[i].playerId*35,250,25);
      gx.fillStyle = "#00FF00";
      gx.fillRect(35,15+this.playerArr[i].playerId*35,250*(this.playerArr[i].hitPoint/this.playerArr[i].maxHitPoint),25);
      gx.fillStyle = "#FFFFFF";
      gx.fillRect(300,15+this.playerArr[i].playerId*35,250,25);
      gx.fillStyle = "#FFFF00";
      gx.fillRect(300,15+this.playerArr[i].playerId*35,250*(this.playerArr[i].energy/this.playerArr[i].maxEnergy),25);
    }
  },
  intersectFunct: function intersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  	if(x1 + w1 > x2 && x1 < x2 + w2) {
  		if(y1 > y2 - h2 && y1 - h1 < y2) {
  			return true;
  		}
  	}
  	return false;
  }
};
