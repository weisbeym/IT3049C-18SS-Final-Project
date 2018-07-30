// inialize Phaser
const game = new Phaser.Game(window.outerWidth, window.outerHeight, Phaser.AUTO);

// only has 1 state
const GameState = {
    preload : function() {
        this.load.image('snake', 'assets/snakeTile.png');
    },
    
    create : function() {
        this.snake = this.game.add.sprite(100, 0, 'snake');
    },
    
    update : function() {

    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');
