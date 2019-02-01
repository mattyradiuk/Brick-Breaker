//V00876753 Matt Radiuk
//Code samples from Mozilla Developer Network and Mathieu Foucault 'Pong Game'

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var level = 1;
var x = canvas.width/2;
var y = canvas.height-150;
var dx = 2;
var dy = -2;
var ballSpeed = 1;
var ballRadius = 12;

var paddleHeight = 12;
var paddleWidth = 90;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var score = 0;
var tempScore = 0;
var lives = 3;

  var brickRowCount = 4;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 40;
  var brickOffsetLeft = 40;

var bricks = [];

for(c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
 

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight-10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ff7de6";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status >= 1) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        if (bricks[c][r].status == 1){
        ctx.fillStyle = "#0095DD";
        }
        if (bricks[c][r].status == 2){
          ctx.fillStyle = "#ff3030";
        }
        if (bricks[c][r].status == 3){
          ctx.fillStyle = "#00ff40";
        }
        if (bricks[c][r].status > 3){
          ctx.fillStyle = "#ffffff";
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  drawLevel();
  
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius-10) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      (ballSpeed += 0.2);
    }
    else {
      lives--;
      ballSpeed = 1.25;
      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-150;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  
  if(x + dx < ballRadius) {
   dx = -dx; 
  }
  
  if(x + dx > canvas.width-ballRadius) {
   dx = -dx; 
  }
  
  x += dx * ballSpeed;
  y += dy * ballSpeed;
  
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    if(level >= 3) {
      paddleX += 5;
    } else {
    paddleX += 3;
    }
  } else if(leftPressed && paddleX > 0) {
    if(level >= 3) {
      paddleX -= 5;
    } else {
      paddleX -= 3;
    }
  }
  
  if(level >= 2) {
    paddleWidth = 120; 
  }
  
  if(score == 2000){
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Powerup Unlocked: Longer Paddle", canvas.width/2-75, canvas.height/2-100);
  }
  if(score == 6000 || score == 6100){
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Powerup Unlocked: Faster Paddle", canvas.width/2-80, canvas.height/2-100);
  
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status >= 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status--;
          score += 100;
          if(score == (2000 * level)+tempScore) {
            tempScore = score;
            x = canvas.width/2;
            y = canvas.height-350;
            ballSpeed = 1.2;
            level++;
            alert("Level: " + level);
            for(c=0; c<brickColumnCount; c++) {
              for(r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: level };
              }
            }
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fontWeight = "bold";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Lives: "+lives, canvas.width-75, 20);
}

function drawLevel() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Level: "+level, (canvas.width/2)-20, 20);
}

var r = confirm("Would you like to play?");
if (r == true) {
  draw();
} else {
  close;
}

