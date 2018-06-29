var gameClass = {
  currTick: 0,
  currTime: 0,

  arenaWidth: 800,
  arenaHeight: 500,
  arenaBounce: 0.55,
  arenaDrag: 0.000175,

  playerArr: [],
  hitArr: [],

  initFunc: function (){
    currTick = 0;
    currTime = new Date().getTime();
    for(var i = 0;i < this.playerArr.length;i++) {
      for(var j = 0;j < this.playerArr[i].moves.length;j++) {
        window.addEventListener(this.playerArr[i].moves[j].eventListener,function (e){this.playerArr[i].moves[j].moveFunc(e,this.playerArr[i].moveInterface);});
      }
    }
  },
  updateFunct: function (){
    this.currTick++;

    for(var i = 0;i < this.hitArr.length;i++) { //Update Hit Duration
      if(this.hitArr[i].startTick < currTick + this.hitArr[i].duration) {
        this.hitArr.splice(i, 1);
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player pos and vel from player move interface object
      this.playerArr[i].posY += this.playerArr[i].moveInterface.cposY;
      this.playerArr[i].posX += this.playerArr[i].moveInterface.cposX;
      this.playerArr[i].velY += this.playerArr[i].moveInterface.cvelY;
      this.playerArr[i].velX += this.playerArr[i].moveInterface.cvelX;
      this.playerArr[i].moveInterface.moveInterface = {cposX: 0,cposY: 0,cvelX: 0,cvelY: 0};
    }
    for(var i = 0;i < this.playerArr.length;i++) { //Update Player Velocities (Gravity and Horizontal Air Resistance)
      this.playerArr[i].velY -= 0.25;
      this.playerArr[i].velX += ((-this.playerArr[i].velX)*this.arenaDrag*this.playerArr[i].height)/this.playerArr[i].mass;
    }

    for(var i = 0;i < this.playerArr.length;i++) { //Update Player Velocities (Arena Collisions)
      if(this.playerArr[i].posY > this.arenaHeight) {
        this.playerArr[i].velY = (Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posY = this.arenaHeight;
      }
      if(this.playerArr[i].posY-this.playerArr[i].height < 0) {
        this.playerArr[i].velY = -(Math.abs(this.playerArr[i].velY)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posY = this.playerArr[i].height;
      }
      if(this.playerArr[i].posX+this.playerArr[i].width > this.arenaWidth) {
        this.playerArr[i].velX = -(Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posX = this.arenaWidth-this.playerArr[i].width;
      }
      if(this.playerArr[i].posX < 0) {
        this.playerArr[i].velX = (Math.abs(this.playerArr[i].velX)*this.arenaBounce)/this.playerArr[i].mass;
        this.playerArr[i].posX = 0;
      }
    }
    for(var i = 0;i < this.playerArr.length;i++) {
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
    gx.fillStyle = "#FF0000";
    for(var i = 0;i < this.hitArr.length;i++) { //Draw hits
      gx.fillRect(newX+this.hitArr[i].posX,newY+(this.hitArr[i].posY-this.hitArr[i].height),this.hitArr[i].width,this.hitArr[i].height);
    }

    gx.fillStyle = "#0000FF";
    for(var i = 0;i < this.playerArr.length;i++) { //Draw players
      gx.fillRect(newX+this.playerArr[i].posX,newY+(this.playerArr[i].posY-this.playerArr[i].height),this.playerArr[i].width,this.playerArr[i].height);
    }
  }
};
/*
function intersect(x1, y1, w1, h1, x2, y2, w2, h2) {
	if(x1 + w1 < x2 || x1 > x2 + w2) {
		if(y1 + h1 < y2 || y1 > y2 + h2) {
			return false;
		}
	}
	return true;
}
*/
