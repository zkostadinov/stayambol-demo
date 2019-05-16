var game = new Phaser.Game(
    '100%', // width of canvas
    '100%', // height of canvas
    Phaser.CANVAS, // use CANVAS and not WEBGL
    'game', // name of the game
    // object with the three functions required for Phaser to work
    {
        preload: function () {
            game.load.image("ball", "ball.jpg");
        },
        create: MyCreateFunction,
        update: MyUpdateFunction,
        render: () => {
            // game.debug.text("Hello World!", 10, 20)
        }
    }
);

const SPEED = 10;
var ball, cursors;

function MyCreateFunction() {
    // pad = game.add.sprite(0, 0, "breakout")
    // pad.animations.add("work",
    //     Phaser.Animation.generateFrameNames('', 50, 52, "-Breakout-Tiles.png"), 10, true);
    // pad.animations.play("work");
    // pad.y = game.world.height = pad.height

	ball = game.add.sprite(10, 10, "ball");
	cursors = game.input.keyboard.createCursorKeys();
}


function MyUpdateFunction() {
	var oldx = ball.x;
	var oldy = ball.y;
	
	if (cursors.up.isDown) {
		ball.y = ball.y - SPEED;
	}
	if (cursors.down.isDown) {
		ball.y = ball.y + SPEED;
	}
	if (cursors.left.isDown) {
		ball.x = ball.x - SPEED;
	}
	if (cursors.right.isDown) {
		ball.x = ball.x + SPEED;
	}
	
	if (oldx != ball.x || oldy != ball.y) {
		setLocationToServer();
	}
}

function setLocationToServer() {
	var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.0.101:8000/gameserver');
    xhr.send(ball.x + '/ ' + ball.y);
}