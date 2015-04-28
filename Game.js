/*jshint browser: true, devel: true, node: true*/
/*global BasicGame,Phaser*/
'use strict';

BasicGame.Game = function (game) {
};

BasicGame.Game.prototype = {

    create: function () {
        
        // Initialise physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Background settings
        this.game.stage.backgroundColor = '#55b4ff';
        this.clouds = this.game.add.sprite(0, 0, 'clouds');
        this.game.physics.enable(this.clouds, Phaser.Physics.ARCADE);
        this.hills = this.game.add.sprite(25, 60, 'hills');
        this.game.physics.enable(this.hills, Phaser.Physics.ARCADE);
        
        // Tilemap settings
        this.map = this.add.tilemap('lvl5'); // Preloaded tilemap
        this.map.addTilesetImage('mtiles', 'tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
    	this.layer.resizeWorld();
    	this.layer.wrap = true;
        
        // Tilemap collision settings
 this.map.setCollisionByExclusion([6,7,8,17,18,19,20,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,58, 21]);
        this.map.setTileIndexCallback([2,3,4], this.hitBlock, this); // [?] collision
        this.map.setTileIndexCallback(1, this.hitBrick, this); // brick collision
        // Mushroom Spawn locations
        this.map.setTileLocationCallback(21, 9, 1, 1, this.mushroomSpawn, this);
        this.map.setTileLocationCallback(77, 9, 1, 1, this.mushroomSpawn, this);
        this.map.setTileLocationCallback(108, 5, 1, 1, this.mushroomSpawn, this);
        // Star Spawn location
        this.map.setTileLocationCallback(100, 9, 1, 1, this.starSpawn, this); // 100
        // Multiple Coins Spawn location
        this.map.setTileLocationCallback(93, 9, 1, 1, this.hitCoins, this);
        // Goomba Spawn locations
        this.map.setTileLocationCallback(10, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(33, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(40, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(41, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(68, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(69, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(85, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(86, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(99, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(101, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(103, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(104, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(106, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(107, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(162, 0, 1, 13, this.goombaSpawn, this);
        this.map.setTileLocationCallback(163, 0, 1, 13, this.goombaSpawn, this);
        // Turtle Spawn Location
        this.map.setTileLocationCallback(98, 0, 1, 13, this.turtleSpawn, this);
        // Flag event location
        this.map.setTileLocationCallback(197, 0, 1, 11, this.levelComplete, this);
        
        // Key events
        this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.jump.onDown.add(this.jumpStart, this);
        this.jumpSpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.jumpSpace.onDown.add(this.jumpStart, this);
        this.jumpA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.jumpA.onDown.add(this.jumpStart, this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fireW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.fireW.onDown.add(this.firing, this);
        
        // Sounds settings
        this.jump = this.game.add.audio('jump');
        this.longJump = this.game.add.audio('longjump');
        this.break = this.game.add.audio('break');
        this.collect = this.game.add.audio('collect');
        this.bump = this.game.add.audio('bump');
        this.growSound = this.game.add.audio('grow');
        this.appear = this.game.add.audio('appear');
        this.death = this.game.add.audio('death');
        this.stomp = this.game.add.audio('stomp');
        this.kick = this.game.add.audio('kick');
        this.down = this.game.add.audio('down');
        this.fire = this.game.add.audio('fireball');
        this.invincible = this.game.add.audio('invincible', 1, true);
        this.flagDown = this.game.add.audio('flag');
        this.flagDown.played = false;
        this.scoreCount = this.game.add.audio('scoreCount', 1, true);
        this.scoreEnd = this.game.add.audio('scoreEnd');
        
        // Music settings
        this.overworld = this.game.add.audio('overworld', 1, true);
        this.invincible = this.game.add.audio('invincible', 1, true);
        this.complete = this.game.add.audio('complete');
        
        // Game timer
        this.timer = this.game.time.events.loop(100, this.gameEvents, this); // 1000ms = 1 second
        
        // Event variables
        this.stateOne = 0;
        this.stateTwo = 0;
        this.coinAlive = false; // Coins don't exist yet
        this.playerGrowing = false;
        this.playerGrown = false;
        this.playerDownSize = false;
        this.dying = false;
        this.dead = false;
        this.crouch = false;
        this.left = false;
        this.right = false;
        this.previousVelocityX = null;
        this.previousVelocityY = null;
        this.lastMushroomSpeed = null;
        this.fired = false;
        this.coinsCollected = 0;
        this.HitCoinsFired = false;
        this.count = false;
        this.timerNegative = false;
        
        // Collision variables
        this.ouch = false; // Player hasn't hit his head yet
        this.questionBoxHit = false;
        this.brickHit = false;
        this.mushroomChange = false;
        this.powerupActive = false;
        this.playerWon = false;
        
        // Game sprites
        this.loadSprites();
        
        this.fade = this.game.add.sprite(0, 0, 'fade');
        this.fade.scale.x = 500;
        this.fade.scale.y = 100;
        this.fade.tint = 0x000000;
        this.fade.alpha = 1;
        
        this.overworld.play();
        
        this.score = 0;
        this.time = 400;
        this.coinCount = 0;
        
        this.display = this.game.add.bitmapText(20, 15, 'font', 'MARIO        WORLD  TIME\n' + '00000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time, 8);
        this.display.fixedToCamera = true;
        
        this.coins = this.add.sprite(86, 24, 'coins','img01.png');
        this.coins.animations.add('change',['img02.png', 'img03.png', 'img01.png'], 8, true, false);
        this.coins.animations.play('change');
        this.coins.scale.x = 0.62;
        this.coins.scale.y = 0.62;
        this.coins.fixedToCamera = true;
        
        this.mute = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.mute.onDown.add(function () {
            this.overworld.stop();
        }, this);
    },
    
    loadSprites: function () {
        this.groupSettings();
        this.flag();
        this.playerSettings();
    },
    
    groupSettings: function () { // Easy access to group settings
        this.emptyBoxes = this.game.add.group();
        this.emptyBoxes.enableBody = true;
        this.emptyBoxes.createMultiple(20, 'empty');
        
        this.bricks = this.game.add.group();
        this.bricks.enableBody = true;
        this.bricks.createMultiple(100, 'brick');
        
        this.mushrooms = this.game.add.group();
        this.mushrooms.enableBody = true;
        this.mushrooms.createMultiple(10, 'mushroom');
        
        this.flowers = this.game.add.group();
        this.flowers.enableBody = true;
        this.flowers.createMultiple(5, 'flowers', 'img01.png');
        
        this.stars = this.game.add.group();
        this.stars.enableBody = true;
        this.stars.createMultiple(5, 'stars', 'img01.png');
        
        this.flags = this.game.add.group();
        this.flags.enableBody = true;
        this.flags.createMultiple(5, 'flags', 'img01.png');
        
        this.goombas = this.game.add.group();
        this.goombas.enableBody = true;
        this.goombas.createMultiple(20, 'enemies', 'img58.png');
        this.goombas.spawned = 0;
        
        this.turtles = this.game.add.group();
        this.turtles.enableBody = true;
        this.turtles.createMultiple(5, 'enemies', 'img31.png');
        
        this.fireBalls = this.game.add.group();
        this.fireBalls.enableBody = true;
        this.fireBalls.createMultiple(500, 'fireballs', 'img01.png');
    },
    
    // SPRITE SETTINGS
    
    playerSettings: function () {
        if (!this.playerGrown) {
            // Player settings
            if (this.playerDownSize) {
                this.player = this.add.sprite(this.player.x, this.player.y, 'mario','img39.png');
            } else {
                this.player = this.add.sprite(50, 200, 'mario','img39.png');
            }
            this.player.anchor.setTo(0.5,1);
        
            // Player physics
            this.game.physics.arcade.enable(this.player);
            this.player.body.gravity.y = 750;
            this.physics.arcade.collide(this.player, this.layer);
            
            if (this.playerDownSize) {
                this.player.body.velocity.y = this.previousVelocityY;
                this.player.body.velocity.x = this.previousVelocityX;
            }
        
            // Player animations
    	   this.player.animations.add('idle',['img39.png'], 10, true, false);
    	   this.walk = this.player.animations.add('walk', ['img40.png', 'img39.png', 'img41.png', 'img39.png'], 10, true, false);
            this.player.animations.add('jump',['img42.png'], 10, true, false);
            this.player.animations.add('growing',['img39.png', 'img33.png'], 10, true, false);
            this.player.animations.add('dying',['img49.png'], 10, true, false);
            this.player.animations.add('pole', ['img44.png', 'img45.png'], 10, true, false);
            this.player.animations.add('stop', ['img44.png'], 10, true, false);
            this.player.animations.add('face', ['img51.png'], 10, true, false);
            this.player.animations.add('peace', ['img50.png'], 10, true, false);
        
            // Camera settings
    	   this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
            
            this.playerDownSize = false;
            this.player.invincible = false;
            
        } else if (this.playerGrown) {
            // Player settings
            this.player = this.add.sprite(this.player.x, this.player.y, 'mario','img01.png');
            this.player.anchor.setTo(0.5,1);
            
            // Player physics
            this.game.physics.arcade.enable(this.player);
            this.player.body.gravity.y = 750;
            this.player.body.velocity.y = this.previousVelocityY;
            this.player.body.velocity.x = this.previousVelocityX;
            
            this.physics.arcade.collide(this.player, this.layer);
                
            // Player animations
            this.player.loadTexture('mario', 'img01.png');
            this.player.animations.add('idle',['img01.png'], 10, true, false);

            this.walk = this.player.animations.add('walk', ['img03.png', 'img01.png', 'img05.png', 'img01.png'], 10, true, false);
            this.player.animations.add('jump',['img07.png'], 10, true, false);
            this.player.animations.add('crouch',['img11.png'], 10, true, false);
            this.player.animations.add('dying',['img49.png'], 10, true, false);
            this.player.animations.add('shrinking',['img25.png', 'img31.png', 'img46.png'], 10, true, false);
            this.player.animations.add('pole', ['img21.png', 'img23.png'], 18, true, false);
            this.player.animations.add('stop', ['img21.png'], 10, true, false);
            this.player.animations.add('face', ['img37.png'], 10, true, false);
            this.player.animations.add('peace', ['img06.png'], 10, true, false);
            
            
            this.player.animations.add('flowerIdle',['img55.png'], 10, true, false);
            this.player.animations.add('flowerWalk',['img57.png', 'img55.png', 'img59.png', 'img55.png'], 10, true, false);
            this.player.animations.add('flowerCrouch',['img65.png'], 10, true, false);
            this.player.animations.add('flowerJump',['img61.png'], 10, true, false);
            this.player.animations.add('firing',['img74.png'], 1, true, false);
            this.player.animations.add('flowerPole', ['img76.png', 'img78.png'], 18, true, false);
            this.player.animations.add('flowerStop', ['img76.png'], 10, true, false);
            this.player.animations.add('flowerFace', ['img91.png'], 10, true, false);
            this.player.animations.add('flowerPeace', ['img28.png'], 10, true, false);
            
            this.player.fireState = false;
            this.player.invincible = false;
            
            // Camera settings
            this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
            
        }
    },
    
    // Mario fireball event // **FIRE UP TO 2 TIMES FOR 2 ALIVE FIREBALLS, STOP WHILE 2 ARE LIVING**
    firing: function () {
        if (!this.fired && this.player.fireState) {
            if (this.fireBalls.countLiving() < 2) {
            this.fired = true;
            this.fireBall();
            }
            this.game.time.events.add(100, function () {
                this.fired = false;
            }, this);
        }
    },
    
    goomba: function (x, y) {
        var goomba = this.goombas.getFirstDead();
        goomba.reset(x + 200, y);
        goomba.body.gravity.y = 1000;
        goomba.body.velocity.x = -30;
        goomba.lifespan = 0;
        goomba.anchor.setTo(0.5,1);
        goomba.checkWorldBounds = true; // Did goomba exit map?
   	    goomba.outOfBoundsKill = true; // If yes, then 'kill' it
        goomba.animations.add('goombaWalk', ['img58.png', 'img59.png'], 8, true, false);
        goomba.animations.add('stomp',['img60.png'], 10, true, false);
        goomba.animations.play('goombaWalk');
        goomba.last = 0;
        goomba.living = true;
        goomba.dying = false;
        this.goombas.spawned++;
    },
    
    turtle: function (x, y) {
        var turtle = this.turtles.getFirstDead();
        turtle.reset(x + 200, 200);
        turtle.body.gravity.y = 1000;
        turtle.body.velocity.x = -30;
        turtle.anchor.setTo(0.5, 1);
        turtle.checkWorldBounds = true; // Did goomba exit map?
   	    turtle.outOfBoundsKill = true; // If yes, then 'kill' it
        turtle.animations.add('turtleWalk', ['img34.png', 'img31.png'], 8, true, false);
        turtle.animations.add('stomp',['img36.png'], 10, true, false);
        turtle.animations.add('up', ['img36.png', 'img37.png'], 7, true, false);
        turtle.animations.add('spin', ['img41.png', 'img43.png', 'img39.png', 'img36.png'], 7, true, false);
        turtle.animations.play('turtleWalk');
        turtle.last = 0;
        turtle.living = true;
        turtle.dying = false;
        turtle.turtle = true;
        turtle.stomped = false;
        turtle.spinning = false;
        turtle.scale.x = 1;
    },
    
    mushroom: function (tile) {
        
        var movement = function () {
            if (this.player.x < mushroom.x) {
                mushroom.body.velocity.x = 50;
            } else if (this.player.x > mushroom.x) {
                mushroom.body.velocity.x = -50;
            }
        };
        
        var mushroom = this.mushrooms.getFirstDead();
        mushroom.reset(tile.worldX, tile.worldY-10);
        mushroom.body.gravity.y = 1000;
        this.lastMushroomSpeed = null;
        mushroom.body.velocity.x = 0;
        mushroom.body.immovable = false;
        mushroom.body.velocity.y = -100;
        mushroom.checkWorldBounds = true; // Did square exit map?
   	    mushroom.outOfBoundsKill = true; // If yes, then 'kill' it
        mushroom.mushroom = true;
        
        this.game.time.events.add(500, movement, this);
    },
    
    flower: function (tile) {
        
        var flower = this.flowers.getFirstDead();
        flower.reset(tile.worldX, tile.worldY-10);
        flower.body.velocity.x = 0;
        flower.body.immovable = true;
        flower.body.gravity.y = 1000;
        flower.body.velocity.y = -100;
        flower.animations.add('flash', ['img04', 'img02.png', 'img03.png', 'img01.png'], 22, true, false);
        flower.animations.play('flash');
        flower.flower = true;
    },
    
    star: function (tile) {
        var star = this.stars.getFirstDead();
        star.reset(tile.worldX, tile.worldY-10);
        star.body.gravity.y = 700;
        star.body.velocity.x = 0;
        star.body.immovable = false;
        star.body.velocity.y = -100;
        star.animations.add('flash', ['img04.png', 'img02.png', 'img03.png', 'img01.png'], 22, true, false);
        star.animations.play('flash');
        star.checkWorldBounds = true; // Did square exit map?
   	    star.outOfBoundsKill = true; // If yes, then 'kill' it
        star.star = true;
        star.body.bounce.x = 1;
        star.released = false;
        
        this.game.time.events.add(500, function () {
            star.body.velocity.x = 80;
            star.body.velocity.y = -250;
            star.released = true;
        }, this);
    },
    
    flag: function () {
        var flag = this.flags.getFirstDead();
        flag.reset(3160, 49);
        flag.body.immovable = true;
        flag.animations.add('wave', ['img02.png', 'img03.png', 'img02.png', 'img01.png'], 7, true, false);
        flag.animations.play('wave');
        flag.moving = false;
    },
    
    fireBall: function () {
        this.fire.play();
        var fireBall = this.fireBalls.getFirstDead();
        if (this.player.scale.x < 0) {
            fireBall.reset(this.player.x - 10, this.player.y - 25);
            fireBall.body.velocity.x = -225;
            fireBall.body.velocity.y = 175;
            fireBall.scale.x = -1;
        } else if (this.player.scale.x > 0) {
            fireBall.reset(this.player.x, this.player.y - 25);
            fireBall.body.velocity.x = 225;
            fireBall.body.velocity.y = 175;
            fireBall.scale.x = 1;
        }
        fireBall.body.gravity.y = 0;
        fireBall.body.bounce.y = 0.95;
        fireBall.body.immovable = true;
        fireBall.animations.add('spinning', ['img02.png', 'img03.png', 'img04.png'], 10, true, false);
        fireBall.animations.play('spinning');
        this.player.animations.play('firing');
        fireBall.lifespan = 1000;
        fireBall.fireBall = true;
    },
    
    mushroomDirection: function () {
        this.mushroomChange = true;
        
        var resetChange = function () {
            this.mushroomChange = false;
        };
        
        if (this.lastMushroomSpeed > 0) {
            this.mushrooms.getAt(0).body.velocity.x = -50;
        } else if (this.lastMushroomSpeed < 0) {
            this.mushrooms.getAt(0).body.velocity.x = 50;
        }
        this.game.time.events.add(200, resetChange, this);
    },
    
    changeDirection: function (enemy) {
        
        if (enemy.body.velocity.x > 0 && enemy.living && !enemy.stomped) {
            if (enemy.turtle) {
                enemy.scale.x = 1;
            }
            enemy.body.velocity.x = -30;
        } else if (enemy.body.velocity.x < 0 && enemy.living && !enemy.stomped) {
            if (enemy.turtle) {
                enemy.scale.x = -1;
            }
            enemy.body.velocity.x = 30;
        } else if (enemy.body.velocity.x === 0 && !enemy.dying && !this.dying && !enemy.stomped) {
            if (enemy.turtle) {
                enemy.scale.x *= -1;
            }
            enemy.body.velocity.x = -enemy.last;
        }
    },
    
    emptyBox: function (tile, itemType) {
        var box = this.emptyBoxes.getFirstDead(); // Select food
        box.reset(tile.worldX, tile.worldY);
        box.body.immovable = true;
        this.tileMovement(box, tile, itemType);
    },
    
    brick: function (tile) {
        var brick = this.bricks.getFirstDead(); // Select food
        brick.reset(tile.worldX, tile.worldY);
        brick.body.immovable = true;
        this.tileMovement(brick, tile);
    },
    
    tileMovement: function (type, tile, itemType) {
        
        var reset = function () {
            var easing = function () {
                if (itemType === 'mushroom') {
                    tile.alpha = 0;
                    this.mushroom(tile);
                    type.body.velocity.y = 0;
                    type.y = tile.worldY;
                } else if (itemType === 'flower') {
                    tile.alpha = 0;
                    this.flower(tile);
                    type.body.velocity.y = 0;
                    type.y = tile.worldY;
                } else if (itemType === 'star') {
                    tile.alpha = 0;
                    this.star(tile);
                    type.body.velocity.y = 0;
                    type.y = tile.worldY;
                } else {
                    type.kill();
                }
            };
            tile.alpha = 1;
            this.game.time.events.add(70, easing, this);
        };
        
        tile.alpha = 0;
        
        var up = function () {
            type.body.velocity.y = -40;
        }; var down = function () {
            type.body.velocity.y = 60;
        };
        this.game.time.events.add(0, up, this);
        this.game.time.events.add(125, down, this);
        this.game.time.events.add(160, reset, this);
    },
    
    // GAME TIMER EVENTS
    
    gameEvents: function () {
        
        if (this.stateOne % 2 === 0 && this.stateOne !== 0 && this.time >= -1 && !this.dying && !this.flag.moving && !this.playerWon && this.playerWon !== 0 && this.playerWon !== 1 && this.playerWon !== 2 && this.playerWon !== 3) {
            this.time--;
        }
            if (this.score < 10) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '00000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 100) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '0000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 1000) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 10000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '00' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '00' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            } else if (this.score < 100000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '0' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '0' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            } else if (this.score < 1000000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            }
        
        // Coin: gradually fade and delete
        if (this.coinAlive && this.coin.alpha > 0.2) {
            this.coin.alpha -= 0.2;
        } else if (this.coinAlive && this.coin.alpha < 0.2) {
            this.coin.destroy();
        }
        
        // Coins, [?]: animate 3 tiles, 100ms per change
        if (this.stateOne === 0) {
            this.map.replace(3, 4);
            this.map.replace(58, 59);
            if (this.playerGrowing || this.player.invincible) {
                this.player.alpha = 0.5;
            }
            this.stateOne ++;
        } else if (this.stateOne === 1) {
            this.map.replace(4, 3);
            this.map.replace(59, 58);
            if (this.playerGrowing || this.player.invincible) {
                this.player.alpha = 1;
            }
            this.stateOne ++;
        } else if (this.stateOne === 2) {
            this.map.replace(3, 2);
            this.map.replace(58, 57);
            if (this.playerGrowing || this.player.invincible) {
                this.player.alpha = 0.5;
            }
            this.stateOne ++;
        } else if (this.stateOne === 3) {
            this.map.replace(2, 3);
            this.map.replace(57, 58);
            if (this.playerGrowing || this.player.invincible) {
                this.player.alpha = 1;
            }
            this.stateOne = 0; // Reset loop
        }
        
        // Leaves: animate 9 tiles (3x3), 300ms per change
        if (this.stateTwo === 0) { // 1st
            this.map.replace(6, 49);
            this.map.replace(7, 50);
            this.map.replace(8, 51);
            this.stateTwo++;
        } else if (this.stateTwo === 1) {
            this.stateTwo++;
        } else if (this.stateTwo === 2) {
            this.stateTwo++;
        } else if (this.stateTwo === 3) { // 2nd
            this.map.replace(49, 52);
            this.map.replace(50, 53);
            this.map.replace(51, 54);
            this.stateTwo++;
        } else if (this.stateTwo === 4) {
            this.stateTwo++;
        }  else if (this.stateTwo === 5) {
            this.stateTwo++;
        }  else if (this.stateTwo === 6) { // 3rd
            this.map.replace(52, 49);
            this.map.replace(53, 50);
            this.map.replace(54, 51);
            this.stateTwo++;
        }  else if (this.stateTwo === 7) {
            this.stateTwo++;
        }  else if (this.stateTwo === 8) {
            this.stateTwo++;
        }  else if (this.stateTwo === 9) { // 4th
            this.map.replace(49, 6);
            this.map.replace(50, 7);
            this.map.replace(51, 8);
            this.stateTwo++;
        }  else if (this.stateTwo === 10) {
            this.stateTwo++;
        }  else if (this.stateTwo === 11) {
            this.stateTwo = 0; // Reset loop
        }
    },
    
    // COLLISION EVENTS
    
    hitCoins: function (sprite, tile) {
        this.HitCoinsFired = true;
        
        //console.log("tileX: " + tile.x);
        //console.log("tileY: " + tile.y);
        var d = tile.worldX - this.player.x;
        this.questionBoxHit = true; // [?] Has been hit by player
        
        var touching = function () {
            if (this.ouch && !this.powerupActive && this.coinsCollected < 6) { // if player hit his head
                this.collect.play();
                this.coin = this.map.putTile(58, tile.x, tile.y-1); // Gen coin above [?]
                this.coin.alpha = 1;
                this.coinCount++;
                this.score += 200;
                this.coinAlive = true;
                this.coinsCollected++;
                this.HitCoinsFired = false;
                return false;
            } if (this.ouch && !this.powerupActive && this.coinsCollected < 7) { // if player hit his head
                this.map.setTileLocationCallback(tile.x, tile.y, 1, 1, null, this);
                this.collect.play();
                this.coin = this.map.putTile(58, tile.x, tile.y-1); // Gen coin above [?]
                this.coin.alpha = 1;
                this.coinCount++;
                this.score += 200;
                this.coinAlive = true;
                this.map.replace(1, 5, tile.x, tile.y, 1, 1); // Replace [?] tile
                this.emptyBox(tile);
                this.coinsCollected++;
                this.HitCoinsFired = false;
                return false;
            } else {
                return true;
            }
        };
        if (d > -20 && d < 20) {
            this.game.time.events.add(0, touching, this);
        }
        return true;
    },
    
    // [?]: collision events
    hitBlock: function (sprite, tile) {
        //console.log("tileX: " + tile.x);
        //console.log("tileY: " + tile.y);
        var d = tile.worldX - this.player.x;
        this.questionBoxHit = true; // [?] Has been hit by player
        
        var touching = function () {
            if (this.ouch && !this.powerupActive) { // if player hit his head
                this.collect.play();
                this.coin = this.map.putTile(58, tile.x, tile.y-1); // Gen coin above [?]
                this.coin.alpha = 1;
                this.coinCount++;
                this.score += 200;
                this.coinAlive = true;
                this.map.replace(2, 5, tile.x, tile.y, 1, 1); // Replace [?] tile
                this.map.replace(3, 5, tile.x, tile.y, 1, 1); // With empty box
                this.map.replace(4, 5, tile.x, tile.y, 1, 1);
                this.emptyBox(tile);
                return false;
            } else {
                return true;
            }
        };
        if (d > -20 && d < 20) {
            this.game.time.events.add(0, touching, this);
        }
        return true;
    },
    
    mushroomSpawn: function (sprite, tile) {
        this.powerupActive = true;
        var d = tile.worldX - this.player.x;
        
        var touching = function () {
            if (this.ouch) { // if player hit his head
                if (!this.playerGrown) {
                    this.map.setTileLocationCallback(tile.x, tile.y, 1, 1, null, this);
                    this.appear.play();
                    this.map.replace(2, 5, tile.x, tile.y, 1, 1); // Replace [?] tile
                    this.map.replace(3, 5, tile.x, tile.y, 1, 1); // With empty box
                    this.map.replace(4, 5, tile.x, tile.y, 1, 1);
                    this.emptyBox(tile, 'mushroom'); // Spawn mushroom
                    return false;
                } else if (this.playerGrown) {
                    this.map.setTileLocationCallback(tile.x, tile.y, 1, 1, null, this);
                    this.appear.play();
                    this.map.replace(2, 5, tile.x, tile.y, 1, 1); // Replace [?] tile
                    this.map.replace(3, 5, tile.x, tile.y, 1, 1); // With empty box
                    this.map.replace(4, 5, tile.x, tile.y, 1, 1);
                    this.emptyBox(tile, 'flower'); // Spawn flower
                    return false;
                } else {
                return true;
                }
            }
        };
        if (d > -20 && d < 20) {
            this.game.time.events.add(0, touching, this);
        }
        return true;
    },
    
    starSpawn: function (sprite, tile) {
        console.log(1);
        this.powerupActive = true;
        var d = tile.worldX - this.player.x;
        
        var touching = function () {
            if (this.ouch) { // if player hit his head
                if (!this.playerGrown) {
                    this.map.setTileLocationCallback(tile.x, tile.y, 1, 1, null, this);
                    this.appear.play();
                    this.map.replace(1, 5, tile.x, tile.y, 1, 1); // Replace brick tile
                    this.emptyBox(tile, 'star'); // Spawn star
                    return false;
                } else if (this.playerGrown) {
                    this.map.setTileLocationCallback(tile.x, tile.y, 1, 1, null, this);
                    this.appear.play();
                    this.map.replace(1, 5, tile.x, tile.y, 1, 1); // Replace brick tile
                    this.emptyBox(tile, 'star'); // Spawn star
                    return false;
                } else {
                return false;
                }
            }
        };
        if (d > -20 && d < 20) {
            this.game.time.events.add(0, touching, this);
        }
        return true;
    },
                
    
    // Brick: collision events
    hitBrick: function (sprite, tile) {
        var d = tile.worldX - this.player.x;
        this.brickHit = true; // brick Has been hit
        
        var touching = function () {
            if (this.ouch && !this.powerupActive) { // if player hit his head
                this.bump.play();
                this.brick(tile);
                return false;
            } else {
                return true;
            }
        };
        
        var canBreak = function () {
            if (this.ouch) {
                this.break.play();
                this.score += 50;
                this.map.removeTile(tile.x, tile.y);
                return true;
            }
        };
        
        if (d > -20 && d < 20) {
            if (!this.playerGrown) {
            this.game.time.events.add(0, touching, this);
            } else if (this.playerGrown && !this.HitCoinsFired) {
                this.game.time.events.add(0, canBreak, this);
            } else {
                this.game.time.events.add(0, touching, this);
            }
        }
        return true;
    },
    
    // Goomba Spawn locations
    goombaSpawn: function (tile) {
        switch (this.goombas.spawned) {
            case 0:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(10, 0, 1, 13, null, this);
                break;
            case 1:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(33, 0, 1, 13, null, this);
                break;
            case 2:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(40, 0, 1, 13, null, this);
                break;
            case 3:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(41, 0, 1, 13, null, this);
                break;
            case 4:
                this.goomba(tile.x, 0);
                this.map.setTileLocationCallback(68, 0, 1, 13, null, this);
                break;
            case 5:
                this.goomba(tile.x, 0);
                this.map.setTileLocationCallback(69, 0, 1, 13, null, this);
                break;
            case 6:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(85, 0, 1, 13, null, this);
                break;
            case 7:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(86, 0, 1, 13, null, this);
                break;
            case 8:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(99, 0, 1, 13, null, this);
                break;
            case 9:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(101, 0, 1, 13, null, this);
                break;
            case 10:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(103, 0, 1, 13, null, this);
                break;
            case 11:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(104, 0, 1, 13, null, this);
                break;
            case 12:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(106, 0, 1, 13, null, this);
                break;
            case 13:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(107, 0, 1, 13, null, this);
                break;
            case 14:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(162, 0, 1, 13, null, this);
                break;
            case 15:
                this.goomba(tile.x, 200);
                this.map.setTileLocationCallback(163, 0, 1, 13, null, this);
                break;
        }
    },
    
    // Turtle spawn location
    turtleSpawn: function (tile) {
        this.map.setTileLocationCallback(98, 0, 1, 13, null, this);
        this.turtle(tile.x,tile.y);
    },
    
    // Enemy hit event (non-stomped)
    enemyHit: function (enemy, object) {
        if (object.fireBall) {
            object.kill();
        }
        enemy.living = false;
        enemy.dying = true;
        enemy.lifespan = 700;
        this.score += 100;
        enemy.animations.stop();
        enemy.body.velocity.y = -250;
        this.kick.play();
        if (this.player.x > enemy.x) {
            enemy.body.velocity.x = -50;
        } else if (this.player.x < enemy.x) {
            enemy.body.velocity.x = 50;
        }
        enemy.body.gravity.x = 50;
        enemy.scale.y = -1;
        this.game.time.events.add(770, function () {
            enemy.living = true;
            enemy.dying = false;
            enemy.scale.y = 1;
            enemy.body.velocity.x = 0;
            enemy.body.gravity.x = 0;
        }, this);
    },
        
    // Mario changing event
    grow: function (player, itemType) {
        var a = false;
        if (this.playerGrown) {
            a = true;
        }
        
        var fullyGrown = function () {
            this.playerGrown = true;
            this.previousVelocityY = this.player.body.velocity.y;
            this.previousVelocityX = this.player.body.velocity.x;
            this.player.kill();
            this.playerSettings();
            this.playerGrowing = false;
        };
        this.growSound.play();
        itemType.kill();
        if (itemType.mushroom || itemType.flower && !this.playerGrown) {
            this.playerGrowing = true;
            this.score += 1000;
            this.player.animations.play('growing');
            this.game.time.events.add(1000, fullyGrown, this);
        } else if (itemType.flower && this.playerGrown) {
            this.playerGrowing = true;
            this.score += 1000;
            this.walk = this.player.animations.add('flowerWalk',['img57.png', 'img55.png', 'img59.png', 'img55.png'], 10, true, false);
            this.player.fireState = true;
            this.game.time.events.add(1000, function () {
                this.playerGrowing = false;
                this.player.alpha = 1;
            }, this);
        } else if (itemType.star) {
            this.score += 1000;
            this.player.invincible = true;
            this.overworld.stop();
            this.invincible.play();
            this.game.time.events.add(11000, function () {
                if (a) {
                    this.playerGrown = true;
                }
                this.player.alpha = 1;
                this.invincible.stop();
                this.player.invincible = false;
                this.overworld.play();
            }, this);
        }
            
    },
    
    // Directly hitting enemy events
    hit: function (player, enemy) {
        if (enemy.body.touching.up) {
            if (!enemy.dying) {
                
                var killEnemy = function () {
                    enemy.kill();
                    this.score += 100;
                    enemy.dying = false;
                };
                if (!enemy.turtle) {
                    enemy.dying = true;
                }
                if (enemy.turtle) {
                    enemy.spinning = false;
                    this.score += 100;
                    enemy.stomped = true;
                    this.game.time.events.add(6000, function () {
                        if (Math.abs(enemy.body.velocity.x) < 10 ) {
                            enemy.animations.play('up');
                            this.game.time.events.add(1500, function () {
                                enemy.animations.play('turtleWalk');
                                enemy.stomped = false;
                                this.changeDirection(enemy);
                            }, this);
                        }
                    }, this);
                }
                player.body.velocity.y = -200;
                enemy.body.velocity.x = 0;
                enemy.animations.stop();
                this.stomp.play();
                enemy.animations.play('stomp');
                if (!enemy.turtle) {
                    this.game.time.events.add(400, killEnemy, this);
                }
            }
        }
        else if (!enemy.dying && !enemy.stomped && !this.playerGrown) {
            
            var delayedJump = function () {
                this.player.body.velocity.y = -225;
            };
            this.dying = true;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.stop();
            this.player.body.gravity.y = 400;
            this.game.time.events.add(200, delayedJump, this);
            this.died();
        }
        else if (enemy.stomped) {
            if (this.player.x < enemy.x) {
                this.kick.play();
                enemy.body.velocity.x = 180;
                enemy.spinning = true;
                this.score += 400;
                this.game.time.events.add(200, function () {
                    enemy.stomped = false;
                }, this);
            } else if (this.player.x > enemy.x) {
                this.kick.play();
                enemy.body.velocity.x = -180;
                enemy.spinning = true;
                this.score += 100;
                this.game.time.events.add(200, function () {
                    enemy.stomped = false;
                }, this);
            }
            enemy.animations.play('spin');
        }
        else if (this.playerGrown && !enemy.dying) {
            var shrinking = function () {
                this.previousVelocityY = this.player.body.velocity.y;
                this.previousVelocityX = this.player.body.velocity.x;
                this.playerGrown = false;
                this.playerDownSize = true;
                this.player.kill();
                this.playerSettings();
                this.playerGrowing = false;
            };
            this.playerGrowing = true;
            this.down.play();
            this.player.animations.play('shrinking');
            this.player.fireState = false;
            this.game.time.events.add(1000, shrinking, this);
        }
    },
    
    // RESET CONTROL
    
    nothing: function () {
        this.active = true;
        return true;
    },
    
    resetOuch: function () {
        this.ouch = false;
        if (this.questionBoxHit) {
        this.questionBoxHit = false;
        } else if (this.brickHit) {
            this.brickHit = false;
        }
        this.powerupActive = false;
    },
    
    // Level Complete
    
    levelComplete: function () {
        this.flag.moving = true;
        this.player.body.gravity.y = 0;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    },
            
    
    // INPUT SETTINGS
    
    playerControls: function () { // Player control handler
    	if (this.cursors.left.isDown && !this.dying && !this.playerWon) { // LEFT
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.velocity.x > -175 && !this.crouch) {
                this.player.body.velocity.x -= 5;
                } else if (this.player.body.velocity.x > -85 && !this.crouch) {
                this.player.body.velocity.x -= 5;
                }
            this.player.scale.x = -1;
        }
            
    	if (this.cursors.right.isDown && !this.dying && !this.playerWon) { // RIGHT
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.velocity.x < 132 && !this.crouch) {
                this.player.body.velocity.x += 6;
                } else if (this.player.body.velocity.x < 84 && !this.crouch) {
                    this.player.body.velocity.x += 6;
                }
            this.player.scale.x = 1;
    	}
    },
    
    jumpStart: function () {
        if (this.player.body.onFloor() && !this.dying && !this.playerWon) { // JUMP
            this.jump.play();
            this.jumping = true;
    	}
    },
    
    update: function () {
        
        // BACKGROUND ANIMATION UPDATE
        
        if (this.player.body.velocity.x > 24 && this.player.x > 150 && this.player.x < 3450 && this.player.exists) {
            this.clouds.body.velocity.x = this.player.body.velocity.x / 1.3;
            this.hills.body.velocity.x = this.player.body.velocity.x / 1.95;
        } else if (this.player.body.velocity.x < -24 && this.player.x > 150 && this.player.x < 3450 && this.player.exists) {
            this.clouds.body.velocity.x = this.player.body.velocity.x / 1.3;
            this.hills.body.velocity.x = this.player.body.velocity.x / 1.95;
        } else {
            this.clouds.body.velocity.x = 0;
            this.hills.body.velocity.x = 0;
        }
        
        // PLAYER ANIMATION UPDATE
        
        if (Math.abs(this.player.body.velocity.x) > 6 && Math.abs(this.player.body.velocity.x) % 6 === 0 && Math.abs(this.player.body.velocity.x) !== 0) {
            this.walk.speed = Math.abs(this.player.body.velocity.x) / 6;
    } else if (Math.abs(this.player.body.velocity.x) < 3) {
        this.walk.speed = 6;
    } else if (Math.abs(this.player.body.velocity.x) < 6) {
        this.walk.speed = 8;
    }
        
        // COLLISION DETECTION
        
        // Player
        if (!this.dying && !this.playerGrowing && !this.player.invincible) {
            this.game.physics.arcade.overlap(this.player, this.goombas, this.hit, null,
        this);
            this.game.physics.arcade.overlap(this.player, this.turtles, this.hit, null,
        this);
        }
        if (!this.dying) {
            this.game.physics.arcade.collide(this.player, this.layer);
        }
        
        this.game.physics.arcade.overlap(this.player, this.mushrooms, this.grow, null,
        this);
        this.game.physics.arcade.overlap(this.player, this.flowers, this.grow, null,
        this);
        this.game.physics.arcade.overlap(this.player, this.stars, this.grow, null,
        this);
        
        // Fireballs
        this.game.physics.arcade.overlap(this.fireBalls, this.layer, function (fireball, layer) {
            fireball.body.gravity.y = 1000;
            if (fireball.body.velocity.x > 0) {
                fireball.body.velocity.x += 50;
            } else if (fireball.body.velocity.x < 0) {
                fireball.body.velocity.x -= 50;
            }
        }, null, this);
        
        
        // Stars
        this.game.physics.arcade.overlap(this.stars, this.layer, function (star, layer) {
            if (star.body.onFloor() && star.released) {
                star.body.velocity.y = -160;
                star.body.gravity.y = 400;
            }
        }, null, this);
        
        this.game.physics.arcade.collide(this.stars, this.layer);
        this.game.physics.arcade.collide(this.stars, this.emptyBoxes);
        this.game.physics.arcade.collide(this.stars, this.bricks);
        
        
        // Mushroom
        if (Math.abs(this.mushrooms.getAt(0).body.velocity.x) > 1 && this.mushrooms.getAt(0).body.velocity.y < 0 && !this.mushroomChange || this.mushrooms.getAt(0).body.blocked.left || this.mushrooms.getAt(0).body.blocked.right || Math.abs(this.mushrooms.getAt(0).body.velocity.x) === 0) { 
            this.mushroomDirection();
        }
        if (Math.abs(this.mushrooms.getAt(0).body.velocity.x) > 10) {
            this.lastMushroomSpeed = this.mushrooms.getAt(0).body.velocity.x;
        }
        if (Math.abs(this.mushrooms.getAt(0).body.velocity.x) > 10) {
            this.lastMushroomSpeed = this.mushrooms.getAt(0).body.velocity.x;
        }
        
        this.game.physics.arcade.collide(this.mushrooms, this.layer);
        this.game.physics.arcade.collide(this.mushrooms, this.emptyBoxes);
        this.game.physics.arcade.collide(this.mushrooms, this.bricks);
        
        
        // Goombas
        for (var g = 0;g < this.goombas.length;g++) {
            if (Math.abs(this.goombas.getAt(g).body.velocity.x) > 1 && this.goombas.getAt(g).body.velocity.y < 0 && !this.goombas.getAt(g).dying || this.goombas.getAt(g).body.blocked.left || this.goombas.getAt(g).body.blocked.right || Math.abs(this.goombas.getAt(g).body.velocity.x) === 0) {
                this.changeDirection(this.goombas.getAt(g));
            }
            if (Math.abs(this.goombas.getAt(g).body.velocity.x) > 10) {
            this.goombas.getAt(g).last = this.goombas.getAt(g).body.velocity.x;
            }
            if (this.player.invincible) {
                this.game.physics.arcade.overlap(this.goombas.getAt(g), this.player, this.enemyHit, null,
        this);
        }
            
            if (this.goombas.getAt(g).living) {
                this.game.physics.arcade.collide(this.goombas.getAt(g), this.layer);
                this.game.physics.arcade.collide(this.goombas.getAt(g), this.goombas);
                this.game.physics.arcade.overlap(this.goombas.getAt(g), this.bricks, this.enemyHit, null,
        this);
                this.game.physics.arcade.overlap(this.goombas.getAt(g), this.emptyBoxes, this.enemyHit, null,
        this);
                this.game.physics.arcade.overlap(this.goombas.getAt(g), this.fireBalls, this.enemyHit, null,
        this);
            }
            if (this.player.x > this.goombas.getAt(g).x + 200) {
                this.goombas.getAt(g).kill();
            }
            if (this.turtles.getAt(0).spinning) {
                this.game.physics.arcade.overlap(this.goombas.getAt(g), this.turtles, this.enemyHit, null,
        this);
            }
            if (this.dying) {
                this.goombas.getAt(g).body.velocity.x = 0;
                this.goombas.getAt(g).animations.stop();
            }
            
        }
        
        // Turtles
        for (var t = 0;t < this.turtles.length;t++) {
            if (Math.abs(this.turtles.getAt(t).body.velocity.x) > 1 && this.turtles.getAt(t).body.velocity.y < 0 && !this.turtles.getAt(t).dying && !this.turtles.getAt(t).stomped || this.turtles.getAt(t).body.blocked.left || this.turtles.getAt(t).body.blocked.right || Math.abs(this.turtles.getAt(t).body.velocity.x) === 0) {
                this.changeDirection(this.turtles.getAt(t));
            }
            if (Math.abs(this.turtles.getAt(t).body.velocity.x) > 10) {
            this.turtles.getAt(t).last = this.turtles.getAt(t).body.velocity.x;
            }
            if (this.player.invincible) {
                this.game.physics.arcade.overlap(this.turtles.getAt(t), this.player, this.enemyHit, null,
        this);
            }
            if (this.turtles.getAt(t).living) {
        this.game.physics.arcade.collide(this.turtles.getAt(t), this.layer);
        this.game.physics.arcade.overlap(this.turtles.getAt(t), this.bricks, this.enemyHit, null,
        this);
        this.game.physics.arcade.overlap(this.turtles.getAt(t), this.emptyBoxes, this.enemyHit, null,
        this);
        this.game.physics.arcade.overlap(this.turtles.getAt(t), this.fireBalls, this.enemyHit, null,
        this);
            }
            if (!this.turtles.getAt(t).spinning) {
                this.game.physics.arcade.collide(this.turtles.getAt(t), this.goombas);
                this.game.physics.arcade.collide(this.turtles.getAt(t), this.turtles);
            }
            if (this.dying) {
                this.turtles.getAt(t).body.velocity.x = 0;
                this.turtles.getAt(t).animations.stop();
            }
        }
        
        // Flowers
        this.game.physics.arcade.collide(this.flowers, this.layer);
        this.game.physics.arcade.collide(this.flowers, this.emptyBoxes);
        this.game.physics.arcade.collide(this.flowers, this.bricks);
        
        // Blocks
        if (this.player.body.blocked.up && this.questionBoxHit) {
            this.ouch = true;
            this.game.time.events.add(200, this.resetOuch, this);
        } else if (this.player.body.blocked.up && this.brickHit) {
            this.ouch = true;
            this.game.time.events.add(200, this.resetOuch, this);
        } 
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
            this.player.x = 3100;
            this.playerGrown = true;
            this.player.kill();
            this.playerSettings();
            }
        
        // Fireballs
        for (var f = 0;f < this.fireBalls.length;f++) {
            if (this.fireBalls.getAt(f).body.blocked.right || this.fireBalls.getAt(f).body.blocked.left) {
                this.fireBalls.getAt(f).kill();
            }
        }
        // End score
        
        if (this.count && this.time > 0) {
            if (!this.scoreCount.isPlaying) {
                this.scoreCount.play();
            }
            this.time -= 1;
            if (this.time & 2 !== 0) {
                this.score += 100;
            }
            if (this.score < 10) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '00000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 100) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '0000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 1000) {
                this.display.text = 'MARIO        WORLD  TIME\n' + '000' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
            } else if (this.score < 10000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '00' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '00' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            } else if (this.score < 100000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '0' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + '0' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            } else if (this.score < 1000000) {
                if (this.coinCount < 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + this.score + '  *' + '0' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                } else if (this.coinCount >= 10) {
                    this.display.text = 'MARIO        WORLD  TIME\n' + this.score + '  *' + this.coinCount + '   ' + '1-1' + '    ' + this.time;
                }
            }
        } else if (this.count && this.time === 0) {
            if (this.timerNegative) {
                this.score += 50;
            }
            this.scoreCount.stop();
            this.scoreEnd.play();
            this.count = false;
        }
        
        // Flag
        
        // Flag events
        if (this.flag.moving) {
            if (!this.flagDown.played) {
                this.game.sound.stopAll();
                this.flagDown.play();
                this.game.time.events.add(900, function () {
                    this.complete.play();
                    this.game.time.events.add(4000, function () {
                        if (this.time % 2 !== 0) {
                            this.timerNegative = true;
                        }
                        this.count = true;
                    }, this);
                }, this);
                this.flagDown.played = true;
            }
            this.playerWon = true;
            if (this.flags.getAt(0).y < 172) {
                this.flags.getAt(0).y += 1.8;
            } else {
                this.flag.moving = false;
            }
            if (this.player.x < 3153) {
                this.player.x += 1;
            } else {
            }
        }
        if (!this.playerGrown && this.player.y < 190 && this.playerWon && this.playerWon !== 0 && this.playerWon !== 1) {
            if (this.player.fireState) {
                        this.player.animations.play('flowerPole');
                    } else {
                        this.player.animations.play('pole');
                    }
            this.player.body.velocity.y += 101;
        } else if (this.playerGrown && this.player.y < 186 && this.playerWon && this.playerWon !== 0 && this.playerWon !== 1) {
            if (this.player.fireState) {
                        this.player.animations.play('flowerPole');
                    } else {
                        this.player.animations.play('pole');
                    }
            this.player.body.velocity.y += 101;
        } else if (this.player.y > 180 && this.playerWon && this.playerWon !== 0 && this.playerWon !== 1) {
            this.player.animations.stop();
            if (this.player.fireState) {
                        this.player.animations.play('flowerStop');
                    } else {
                        this.player.animations.play('stop');
                    }
            if (!this.flag.moving && this.player.x < 3166) {
                this.player.x = 3166;
                this.player.scale.x = -1;
            } else if (this.player.x >= 3166) {
                this.player.body.gravity.y = 1000;
                this.game.time.events.add(500, function () {
                    console.log("1: " + this.playerWon);
                    this.playerWon = 0;
                    console.log("2: " + this.playerWon);
                    this.player.scale.x = 1;
                    this.walk.speed = 9;
                    this.player.body.velocity.x = 89;
                }, this);
            }
        }
        if (this.playerWon === 0 && this.player.x < 3261) {
            this.walk.speed = 9;
            this.player.body.velocity.x = 89;
        } else if (this.player.x >= 3200 && this.playerWon === 0) {
            this.player.body.velocity.x = 0;
            this.game.time.events.add(200, function () {
                this.player.animations.stop();
                if (this.player.fireState) {
                        this.player.animations.play('flowerFace');
                    } else {
                        this.player.animations.play('face');
                    }
                this.playerWon = 1;
                this.game.time.events.add(200, function () {
                    this.player.x = 3262;
                    this.player.animations.stop();
                    if (this.player.fireState) {
                        this.player.animations.play('flowerPeace');
                    } else {
                        this.player.animations.play('peace');
                    }
                    if (this.playerGrown) {
                        this.player.x += 1;
                    }
                    this.game.time.events.add(1000, function () {
                        this.playerWon = 2;
                        this.player.body.velocity.x = 30;
                    }, this);
                }, this);
            }, this);
        } else if (this.playerWon === 3) {
            this.player.body.velocity.x = 0;
            this.player.exists = false;
        }
        
        if (this.playerWon === 2 && this.player.alpha > 0.1) {
            if (this.playerGrown) {
                this.player.alpha -= 0.2;
            } else if (!this.playerGrown) {
                this.player.alpha -= 0.1;
            }
        } else if (this.player.alpha <= 0.1) {
            this.player.appear = 0;
            this.playerWon = 3;
        }
        
        // RESET PLAYER MOVEMENT SPEED
        
        if (this.player.body.velocity.x > 0 && !this.jumping) {
            this.player.body.velocity.x -= 1;
        } else if (this.player.body.velocity.x > 0 && this.jumping) {
            this.player.body.velocity.x += 2;
        } else if (this.player.body.velocity.x < 0 && !this.jumping) {
            this.player.body.velocity.x += 1;
        } else if (this.player.body.velocity.x < 0 && this.jumping) {
            this.player.body.velocity.x -= 2;
        }
        
        // JUMP HANDLER
        // Jump speed is determined by how long jump key is held
        
        if (this.jumping) {
            var x = 50;
            if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                if (this.player.body.blocked.up) {
                    this.jumping = false;
                }
                if (this.player.body.velocity.y > -251 && Math.abs(this.player.body.velocity.x) < 85) {
                    this.player.body.velocity.y -= 51;
                } else if (this.player.body.velocity.y > -301 && Math.abs(this.player.body.velocity.x) > 85) {
                    this.player.body.velocity.y -= 51;
                }
                else {
                    this.jumping = false;
                }
            }
            else {
                this.jumping = false;
            }
        }
        
        // Input detection
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.crouch = true;
        } else {
            this.crouch = false;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.left = true;
        } else {
            this.left = false;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.right = true;
        } else {
            this.right = false;
        }
        
        // Animation input detection
        if (this.player.body.velocity.y > -1 && this.player.body.onFloor && Math.abs(this.player.body.velocity.x) > 10 && !this.playerGrowing && !this.crouch && !this.player.fireState && !this.fired) {
            this.player.animations.play('walk');
        } else if (this.player.body.velocity.y > -1 && this.player.body.onFloor && Math.abs(this.player.body.velocity.x) > 10 && !this.playerGrowing && !this.crouch && this.player.fireState && !this.fired) {
            this.player.animations.play('flowerWalk');
        } else if (this.player.body.velocity.y < 0 && !this.playerGrowing && !this.crouch && !this.dying && !this.player.fireState && !this.fired) {
            this.player.animations.play('jump');
        } else if (this.player.body.velocity.y < 0 && !this.playerGrowing && !this.crouch && !this.dying && this.player.fireState && !this.fired) {
            this.player.animations.play('flowerJump');
        } else if (this.crouch && this.playerGrown && !this.jumping && !this.right && !this.left && !this.player.fireState && !this.fired) {
            this.player.animations.play('crouch');
        } else if (this.crouch && this.playerGrown && !this.jumping && !this.right && !this.left && this.player.fireState && !this.fired) {
            this.player.animations.play('flowerCrouch');
        } else if (this.dying) {
            this.player.animations.play('dying');
        } else {
            if (!this.playerGrowing && !this.crouch && !this.player.fireState && !this.fired && !this.playerWon && this.playerWon !== 1) {
            this.player.animations.play('idle');
            } else if (!this.playerGrowing && !this.crouch && this.player.fireState && !this.fired && !this.playerWon) {
            this.player.animations.play('flowerIdle');
            }
        }
        this.playerControls();
        
        // Fade-in from black
        if (this.fade.alpha > 0.1)
        this.fade.alpha -= 0.04;
        
        // DEATH EVENTS
        
        // Player lower than map height
        if (this.player.y > 224) {
            this.died();
        }
        
        if (this.time === -1 && !this.dying) {
            this.dying = true;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.stop();
            this.player.body.gravity.y = 400;
            this.game.time.events.add(200, function () {
                this.player.body.velocity.y = -225;
                
            }, this);
            this.died();
        }
        
    },
    
    // Dying events
    died: function () {
        this.dying = true;
        //this.goombas.getAt(0).kill();
        if (!this.dead) {
            this.game.sound.stopAll();
            this.death.play();
            this.dead = true;
        } else {
            this.game.time.events.add(4000, this.restartGame, this);
        }
    },
    
    restartGame: function () {
        this.state.start('Game'); // Reset game
    },
    
    render: function () {
        // Pixel scaling
        BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width,
                                          this.game.height, 0, 0, BasicGame.pixel.width,
                                          BasicGame.pixel.height);

	},

    quitGame: function (pointer) {
    	
        this.state.start('MainMenu');

    }
    
    // TODO
    //
    // - Star power up - animation, events, collision;
    // - Points from coins, enemies, flag, time;
    // - Flag - animation, event, collision;
    // - Time - Game over, points, sounds;
    // - Music;
    //
    // BUGS
    //
    // - Tiles - when enemy stands on an ajacent tile, it can break if player hits unconnnected tile at the same time;
    // - Turtle - Events aren't 100% correct;
    // - Running - animation doesn't update correctly when changing direction and holding movement keys;
    // - Spawning - some enemies, especially latter enemies are unable to spawn or are bunched together in the same area
    // - Crouch - persists even when dying or 'growing';
    // - Misc - lots of small bugs;

};
