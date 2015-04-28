/*jslint node: true*/
/*global Phaser*/
'use strict';

var BasicGame = {
    pixel: { scale: 3, canvas: null, context: null, width: 0, height: 0 },
};



BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {
        
        //  Hide the un-scaled game canvas
        this.game.canvas.style['display'] = 'none';
     
        //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
        BasicGame.pixel.canvas = Phaser.Canvas.create(this.game.width * BasicGame.pixel.scale, this.game.height * BasicGame.pixel.scale);
     
        //  Store a reference to the Canvas Context
        BasicGame.pixel.context = BasicGame.pixel.canvas.getContext('2d');
     
        //  Add the scaled canvas to the DOM
        Phaser.Canvas.addToDOM(BasicGame.pixel.canvas);
     
        //  Disable smoothing on the scaled canvas
        Phaser.Canvas.setSmoothingEnabled(BasicGame.pixel.context, false);
     
        //  Cache the width/height to avoid looking it up every render
        BasicGame.pixel.width = BasicGame.pixel.canvas.width;
        BasicGame.pixel.height = BasicGame.pixel.canvas.height;

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.game.stage.backgroundColor = "FFFFFF";
        this.load.image('loadBar', 'assets/bar.png');
        this.load.image('loadText', 'assets/text.png');

    },

    create: function () {
        
        this.input.maxPointers = 1;
        // Pause when changing tab
        this.stage.disableVisibilityChange = true;
        
        this.state.start('Preloader');

    }

};
