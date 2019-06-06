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
	
	// game.time.events.repeat(Phaser.Timer.SECOND, 10000000, readBallLocation, this);
	readBallLocation();
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
    xhr.open('POST', 'http://127.0.0.1:8080/gameserver');
    xhr.send(ball.x + '/' + ball.y);
}

function readBallLocation() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8080/gameserver');
	xhr.onreadystatechange = function(p) {
		if(xhr.readyState === 4 && xhr.status === 200) {

			if (cursors.right.isDown || cursors.left.isDown || 
				cursors.up.isDown || cursors.down.isDown) {
				console.log("cursor down - skip");
				return;
			}

			var ballLocation = p.target.responseText;
			console.log("Server said: " + ballLocation);
			var xy = ballLocation.split("/");
			ball.x = parseInt(xy[0]);
			ball.y = parseInt(xy[1]);
			setTimeout(readBallLocation, 1000);
		}
	}
	xhr.send();
}
