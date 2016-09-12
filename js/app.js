
//gameBoard object - the height and width are based on those of the canvas drawn in engine.js, i.e. canvas.width = 505; canvas.height = 606;
//height of the gameboard takes into consideration of margins, 21.5 each, and gravel, 83, in the grass area
var gameBoard = {
    height: 480,
    width: 505
};

//Decorative Class for both player and enemy
var Base = function(x, y, sprite) {
    this.xPos = x;
    this.yPos = y;
    this.sprite = sprite;
}


//Enemy Class
var Enemy = function() {

    //horizontal position of the enemy
    //this.xPos = 0;
    //vertical position of the enemy - placed ONLY in the road area
    //NOTE, the bug is randomly placed on the three-lane road based on the randomly assigned index
    //this.yPos = [(gameBoard.height/6) - 20, (gameBoard.height/6)*2 -20, (gameBoard.height/6)*3 -20][this.getYIndex()];
    Base.call(this, 0, [(gameBoard.height/6) - 20, (gameBoard.height/6)*2 -20, (gameBoard.height/6)*3 -20][this.getYIndex()], 'images/enemy-bug.png');
    this.speed = this.speedIncrement();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //this.sprite = 'images/enemy-bug.png';
};

/**
 * @description determine which lane on the three-land road the bug will be placed
 */
Enemy.prototype.getYIndex = function () {
    //return a random index between 0 to 2
    return Math.floor(Math.random() * 3);
};


/**
 * @description determine the speed increment for the bug, range 100 ~ 500
 */
Enemy.prototype.speedIncrement = function() {
    var base = 100;
    var increment = Math.floor(Math.random() * 4) * 100;
    return base + increment;
};

/**
 * @description update the enemy's position, required method for game
 * @param {decimal number}: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers
    var tick = dt*1000;
    if (this.xPos < gameBoard.width) this.xPos = this.xPos + dt * this.speed;
    else this.xPos = -100 + dt * this.speed;
};

/**
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};


// Player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {

    this.defaultXPos = gameBoard.width/5 * 2;
    this.defaultYPos = gameBoard.height/6 * 5;
    Base.call(this, this.defaultXPos, this.defaultYPos, 'images/char-horn-girl.png');
    this.score = 0;
    Resources.load(this.sprite);
    // this.xPos = this.defaultXPos;
    // this.yPos = this.defaultYPos;
    // this.sprite = 'images/char-horn-girl.png';

};

/**
 * @description reset the player position back to original position (and) reset score back to 0 if starting a new game
 */
Player.prototype.reset = function (isNewGame) {
    this.xPos = this.defaultXPos;
    this.yPos = this.defaultYPos;
    if (isNewGame) this.score = 0;
}

/**
 * @description adding message to the message div, e.g. score, if the player has won
 * @param {string} message - text to be displayed in the div
 */
Player.prototype.updateMessage = function(message) {
    if (message != null) {
        document.getElementById("messageContainer").innerHTML = message;
    }
}

/**
 * @description method that executes when the player has won
 */
Player.prototype.handleWin = function () {
     this.score++;
     this.updateMessage("You crossed! Score: " + this.score);
     this.reset();
     //invoking the click event of pause button to pause the game
     document.getElementById("pauseButton").click();

}

/**
 * @description method runs on each animation frame
 * update player position when necessary i.e. collision occurs
 * update UI when player won
 */
Player.prototype.update = function () {

    //check if player reach the end, which means it has won
    if (this.yPos == 0) {
        setTimeout('player.handleWin();', 0);
        return false;
    }
    //check for collision with the enemy
    if (this.hasCollision()) {
       this.reset();
    }
    //update score on the message div
    this.updateMessage("Score: " + this.score);
    //console.log("dt: " + dt + " x: " + this.xPos + " y: " + this.yPos)
};


/**
 * @description method that renders the player
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};


/**
 * @description method that determines whether collision with the enemy has occurred
 */
 Player.prototype.hasCollision = function () {

    var enemyPos, playerPos;
    //the dimensions of the image e.g. player and enemy based on those of the game board minus the margin
    var imageWidth = gameBoard.width/5  - 20;
    var imageHeight = gameBoard.height/6 - 20;


    for (var index = 0; index < allEnemies.length; index++) {
        /**
         *  if x and y coordinate of player and those of enemy intersects then collision has occurred.
         *  The calculation needs to take into consideration of the player and enemy's dimensions, i.e. width and height
        */
        if (this.xPos < allEnemies[index].xPos + imageWidth &&
            this.xPos + imageWidth > allEnemies[index].xPos &&
            this.yPos < allEnemies[index].yPos + imageHeight &&
            this.yPos + imageHeight > allEnemies[index].yPos) {
            if (this.score > 0) this.score--;
            else this.score = 0;
            return true;
        }
        //uncomment to debug
        //console.log("enemy: " + enemyPos.x + " " + enemyPos.y + " player: " + playerPos.x + " " + playerPos.y);
    }

    return false;
};

/**
 @description method that executes when user hits designated keys on the keyboard
 */
Player.prototype.handleInput = function (key) {

    //the set amount to move horizontally, i.e. stepX, or vertically, i.e. stepY
    var stepX = Math.floor(gameBoard.width/5);
    var stepY = Math.floor((gameBoard.height)/6);

    //uncomment to debug
    //console.log("Stepx: " + stepX + " stepY: " + stepY + " x: " + this.xPos + " y: " + this.yPos);

    //in each, need to make sure the player doesn't go out of bound
    switch(key) {
        case 'left':
            if ((this.xPos - stepX) > 0) this.xPos = this.xPos - stepX;
            else this.xPos = 0;
            break;
        case 'right':
            if ((this.xPos + stepX) < gameBoard.width) this.xPos = this.xPos + stepX;
            //console.log(this.xPos + " canvas width: " + gameBoard.width);
            break;
        case 'down':
            if (this.yPos + stepY < gameBoard.height) this.yPos = this.yPos + stepY;
            //console.log("canvas height: " + canvas.height + " y: " + this.yPos + " calculated height: " + (canvas.height-(step*8)));
            break;
        case 'up':
            if ((this.yPos - stepY) >= 0) {
                this.yPos = this.yPos - stepY;
            }
            else {
                //won the game if reached here
                 this.yPos = 0;
            }
            break;
    }

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @description helper function - implementation for buttons that restart or pause the game
 * @param {object} button, an input button object
 */
function toggleButton (button) {
    switch(button.getAttribute('id')) {
        case 'pauseButton':
            //this will stop animation
            resetCanvas();
            button.setAttribute('disabled', true);
            //enable start button
            document.getElementById('startButton').removeAttribute('disabled');
            break;
        case "startButton":
            //this will restart animation
            initCanvas();
            button.setAttribute('disabled', true);
            //enable pause button
            document.getElementById('pauseButton').removeAttribute('disabled');

    }
}

//message div container that displays relevant message e.g. when player won
var messageDiv = document.createElement('div');
messageDiv.setAttribute('id', 'messageContainer');
document.body.appendChild(messageDiv);
//div that contains buttons for starting or pausing the game
var footerDiv = document.createElement('div');
footerDiv.setAttribute('id', 'footerContainer');
document.body.appendChild(footerDiv);

var infoContent = 'In this game you have a Player and Enemies (Bugs).\n The goal of the player is to reach the water, without colliding into any one of the enemies.\n The player can move left, right, up and down via the corresponding arrow keys on the keyboard.\nThe enemies move in varying speeds on the paved block portion of the scene.\nOnce a the player collides with an enemy, the game is reset and the player moves back to the start square.\nOnce the player reaches the water the game is won.\nOne point is awarded each time the player wins in this session.'
document.getElementById('footerContainer').innerHTML = '<input id="pauseButton" type="button" value="Pause" onclick="toggleButton(this)"/><input id="startButton" disabled="true" type="button" value="Start" onclick="toggleButton(this)"/><div class="howTo" title="How to play the game" onclick="alert(infoContent);">?</div>';



