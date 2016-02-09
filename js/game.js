var MissleDodge = {
	WIDTH: 0,
	HEIGHT: 0,
	MaxWidth: 640,
	MaxHeight: 360
};

//the bootstate
MissleDodge.bootState = function() {};
MissleDodge.bootState.prototype = {
	init: function() 
	{
		Phaser.Canvas.setImageRenderingCrisp(game.canvas);  //for Canvas, modern approach
		Phaser.Canvas.setSmoothingEnabled(game.context, false);  //also for Canvas, legacy approach
		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
		this.stage.disableVisibilityChange = true;

		//scaling stuff
		if (game.device.desktop) 
		{
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.parentIsWindow = true;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
		}
		else 
		{
			this.scaler(360, 640);
		}
	},

	scaler: function(maxW, maxH) {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.parentIsWindow = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
	},

	create: function() {        
		//initializing the physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		//setting the background color
        this.stage.backgroundColor = "#00FFF0";
        
        //starting the next state
		this.state.start("preload");
	}
};

//the preloadstate
MissleDodge.preloadState = function() {};
MissleDodge.preloadState.prototype = {
	preload: function() {
		this.load.image("heart", "assets/heart.png");
	}, 

	create: function() {
		this.state.start('menu');
	}
}

//the menuState
MissleDodge.menuState = function() {};
MissleDodge.menuState.prototype = {
	create: function() {
		this.instructionsText = game.add.text(this.world.centerX, this.world.centerY, "Touch to start");
		this.instructionsText.anchor.setTo(0.5);
	},

	update: function() {
		if (this.input.activePointer.isDown) {
			this.state.start('game');
		};
	}
}

//the gamestate
MissleDodge.gameState = function(game){
	var heartGroup;
	var heartCount;
	var heartGravity;
	var spawnSpeed;

};
MissleDodge.gameState.prototype = {
	create: function() {
		heartGroup = game.add.group();
		//keeping the heart count
		heartCount = 0;

		heartGravity = 1500;
		spawnSpeed = 1;

		this.time.events.loop(spawnSpeed, this.spawnHeart, this);
	},
	update: function() {
		heartGroup.forEach(function(sprite) {
			if (sprite.y >= window.innerHeight + 60) {
				sprite.destroy();
				heartCount ++;
			};
		}, this);
	},

	spawnHeart: function() {
		var heart = heartGroup.create(30 + Math.random() * (window.innerWidth - 30), -50, "heart");
		heart.anchor.setTo(0.5);
		//enable physics for the heart
		this.physics.arcade.enable(heart);
		heart.body.velocity.y = heartGravity;
		heartGroup.add(heart);

	}
}

//the default screen size
var WIDTH = 340;
var HEIGHT = 640;

//initializing the game
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, "gameDiv");

game.state.add("boot", MissleDodge.bootState);
game.state.add("preload", MissleDodge.preloadState);
game.state.add("menu", MissleDodge.menuState);
game.state.add("game", MissleDodge.gameState);

game.state.start("boot");