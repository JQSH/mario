/*jshint browser: true, devel: true, node: true*/
/*global BasicGame,Phaser*/
'use strict';

BasicGame.Preloader = function (game) {
    
	this.background = null;
	this.loadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.loadBar = this.add.sprite(190, 250, 'loadBar');

		//	This sets the loadBar sprite as a loader sprite.
		this.load.setPreloadSprite(this.loadBar);
		
		this.load.image('player', 'assets/player.png');
        this.load.image('empty', 'assets/empty.png');
        this.load.image('brick', 'assets/brick.png');
        this.load.image('mushroom', 'assets/mushroom.png');
        this.load.image('mushroom', 'assets/mushroom.png');
        this.load.image('clouds', 'assets/clouds.png');
        this.load.image('hills', 'assets/hills.png');
        this.load.image('fade', 'assets/box.png');
        
        this.load.tilemap('lvl5', 'assets/lvl5.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tileset', 'assets/mtiles.png'); // loading the tileset image
        
        this.game.load.atlas('mario', 'assets/sprites2x.png', 'assets/sprites2x.js');
        this.game.load.atlas('enemies', 'assets/enemies.png', 'assets/enemies.js');
        this.game.load.atlas('flowers', 'assets/flowers.png', 'assets/flowers.js');
        this.game.load.atlas('fireballs', 'assets/fireballs.png', 'assets/fireballs.js');
        this.game.load.atlas('coins', 'assets/coins.png', 'assets/coins.js');
        this.game.load.atlas('stars', 'assets/stars.png', 'assets/stars.js');
        this.game.load.atlas('flags', 'assets/flags.png', 'assets/flags.js');
        
        this.game.load.bitmapFont('font', 'assets/nintendo.png', 'assets/nintendo.fnt');
        
        // Load audio / music
		this.load.audio('jump', 'assets/jump.wav');
		this.load.audio('collect', 'assets/coin.wav');
		this.load.audio('break', 'assets/break.wav');
        this.load.audio('bump', 'assets/bump.wav');
        this.load.audio('appear', 'assets/item.wav');
        this.load.audio('grow', 'assets/powerup.wav');
        this.load.audio('death', 'assets/die.wav');
        this.load.audio('stomp', 'assets/stomp.wav');
        this.load.audio('kick', 'assets/kick.wav');
        this.load.audio('down', 'assets/down.wav');
        this.load.audio('fireball', 'assets/fireball.wav');
        this.load.audio('flag', 'assets/flag.wav');
        this.load.audio('scoreCount', 'assets/scoreCount.wav');
        this.load.audio('scoreEnd', 'assets/scoreEnd.wav');
        this.load.audio('invincible', 'assets/invincible.wav');
        this.load.audio('overworld', 'assets/overworld.mp3');
        this.load.audio('complete', 'assets/levelCompleteMusic.wav');
        

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		// this.loadBar.cropEnabled = false;
		
		this.state.start('MainMenu');

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		// {
			// this.ready = true;
			// this.state.start('MainMenu');
		// } 
	}
};
