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
        
        this.preloadBar = this.game.add.graphics(0, 50);
        this.preloadBar.lineStyle(3, 0xffffff, 1);
        this.preloadBar.moveTo(0, 0);
        this.preloadBar.lineTo(game.width, 0);
    
        this.preloadBar.scale.x = 0; // set the bar to the beginning position

    },
    
    function loadUpdate() {
    // every frame during loading, set the scale.x of the bar to the progress (an integer between 0
    // and 100) divided by 100 to give a float between 0 and 1
    this.preloadBar.scale.x = game.load.progress * 0.01;
}

    create: function () {
        
        this.input.maxPointers = 1;
        // Pause when changing tab
        this.stage.disableVisibilityChange = true;
        
        this.state.start('Preloader');

    }

};
