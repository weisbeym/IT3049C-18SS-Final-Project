// setup
const directions = Object.freeze({up: 0, down: 1, right: 2, left: 3});
let head, tail, cursors, snake, food, gameText, playerDirection;
const canvasWidth = 832, canvasHeight = 640; 
let playerSize = 64;
let x = 128, y = 0;
let frameCounter = 0;
let gameSpeed = 20;
let score = 0;

// inialize Phaser
const game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, '');


// only has 1 state
const GameState = {
    preload : function() {
        this.load.image('snake', 'assets/snakeTile.png');
        this.load.image('food', 'assets/foodTile.png');
        //this.load.image('background', 'assets/background.png');
    },
    
    create : function() {
       //this.background = this.game.add.sprite(0, 0, 'background'); <-- might go back to background image
        gameText = game.add.text(canvasWidth, 0, "0", {
            font: "28px Arial",
            fill: "#fff"
        });
        gameText.anchor.setTo(1, 0);
        initSnake();
        placeRandomApple();

        cursors = game.input.keyboard.createCursorKeys();
    },
    
    update : function() {
        gameText.text = score;
        updateDirection();
        frameCounter++;
        if (frameCounter == gameSpeed) {
            movePlayer();
            if (playerCollidesWithSelf()) {
                alert("The game is over! Your score was: " + score);
                deleteSnake();
                initSnake();
                score = 0;
                gameSpeed = 20;
                playerDirection = undefined;
                x = 128;
                y = 0;
                gameText.text = "";
            }
            if (foodCollidesWithSnake()) {
                score++;
                apple.destroy();
                placeRandomFood();
                gameSpeed--;
                if (gameSpeed <= 5) gameSpeed = 5;
            } else if (playerDirection != undefined) {
                removeTail();
            }
            frameCounter = 0;
        }
    }
};

function initSnake() {
    head = new Object();
    newHead(0, 0);
    tail = head;
    newHead(64, 0);
    newHead(128, 0);

}

function deleteSnake() {
    while (tail != null) {
        tail.image.destroy();
        tail = tail.next;
    }
    head = null;
}

function placeRandomFood() {
    if (food != undefined) food.destroy();
    food = game.add.image(0, 0, 'food');
    do {
        food.position.x = Math.floor(Math.random() * 13) * 64;
        food.position.y = Math.floor(Math.random() * 10) * 64;
    } while (foodCollidesWithSnake());
}

// linked list functions

function newHead(x, y) {
    const newHead = new Object();
    newHead.image = game.add.image(x, y, 'elephant');
    newHead.next = null;
    head.next = newHead;
    head = newHead;
}

function removeTail(x, y) {
    tail.image.destroy();
    tail = tail.next;
}

// collision functions

function foodCollidesWithSnake() {
    // traverse the linked list, starting at the tail
    let needle = tail;
    let collides = false;
    let numTimes = 0;
    while (needle != null) {
        numTimes++;
        if (food.position.x == needle.image.position.x && 
            food.position.y == needle.image.position.y) {
            collides = true;
        }
        needle = needle.next;
    }
    return collides;
}

function playerCollidesWithSelf() {
    // check if the head has collided with any other body part, starting at the tail
    var needle = tail;
    var collides = false;
    while (needle.next != head) {
        if (needle.image.position.x == head.image.position.x &&
            needle.image.position.y == head.image.position.y) {
            collides = true;
        }
        needle = needle.next;
    }
    return collides;
}

// movement functions
function updateDirection() {
    if (cursors.right.isDown && playerDirection != directions.left) {
        playerDirection = directions.right;
    }
    if (cursors.left.isDown && playerDirection != directions.right) {
        playerDirection = directions.left;
    }
    if (cursors.up.isDown && playerDirection != directions.down) {
        playerDirection = directions.up;
    }
    if (cursors.down.isDown && playerDirection != directions.up) {
        playerDirection = directions.down;
    }
}

function movePlayer() {
    if (playerDirection == directions.right) {
        x += playerSize;
    } else if (playerDirection == directions.left) {
        x -= playerSize;
    } else if (playerDirection == directions.up) {
        y -= playerSize;
    } else if (playerDirection == directions.down) {
        y += playerSize;
    }
    if (x <= 0 - playerSize) {
        x = canvasWidth - playerSize;
    } else if (x >= canvasWidth) {
        x = 0;
    } else if (y <= 0 - playerSize) {
        y = canvasHeight - playerSize;
    } else if (y >= canvasHeight) {
        y = 0;
    }
    if (playerDirection != undefined) {
        newHead(x, y);
    }
}

game.state.add('GameState', GameState);
game.state.start('GameState');
