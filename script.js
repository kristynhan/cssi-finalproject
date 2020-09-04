/* global createCanvas, background, colorMode, HSB,
 *     loadImage, image, mouseX, mouseY, text, width, height,
 *     fill, noStroke, ellipse, ellipseMode, CENTER, textSize, random, rect
 *     keyCode, BACKSPACE, textStyle, BOLD, noFill, noStroke, collideRectCircle,
 *     constrain, redraw, soundFormats, loadSound, imageMode, createSlider, createButton, color, frameCount
 *     stroke, noLoop, textAlign, textFont
 */

const num_waffleCone = 9;
let BackspaceIsPressed, spaceIsPressed;
let player1ImageWidth, player1ImageHeight;
let backgroundImage, player1Image, startScreenImage, banner;
let gameoverImage, mode;
let waffleCone, xWaffle, yWaffle, waffleWidth, waffleHeight;
let scoops, yVelocity;
let lives, score;
let gameIsOver;
let menu = 0;
let gameSound, gameoverSound, winnerSound;
let winnerPage;
let delayTime = 150;
let restartButton, startButton, instructionsButton, exitButton;
let collisionWaitTime = 0;
let hit;

//level variables
let level = 1;
let timer = 62;
let clearScoops = 0;
let levelScreenCounter = 0;
let levelDisplayTime = 100;
let displayTime = false;

function preload() {
  startScreenImage = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fhouse.png?v=1595923133913"
  );
  banner = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2FScreen%20Shot%202020-07-28%20at%2010.00.49%20AM.png?v=1595955705625"
  );
  gameSound = loadSound(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2FIce%20Cream%20Song%20Loop%20(128%20%20kbps).mp3?v=1596172636227"
  );
  gameoverSound = loadSound(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2FRetro-game-over-sound-effect.mp3?v=1596109037640"
  );

  winnerSound = loadSound(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fgame-win-sound-effect.mp3?v=1596113858114"
  );
}

function setup() {
  createCanvas(700, 500);
  gameSound.play();
  // console.log("hi");
  colorMode(HSB, 360, 100, 100);
  gameIsOver = false;
  backgroundImage = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fice%20cream%20shop.jpg?v=1595742917970"
  );
  player1Image = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fspongebob.png?v=1595629269872"
  );
  gameoverImage = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fgo.png?v=1596077033918"
  );
  winnerPage = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fwon.png?v=1596112059305"
  );

  xWaffle = 25;
  yWaffle = 410;

  waffleWidth = 50;
  waffleHeight = 80;
  waffleCone = loadImage(
    "https://cdn.glitch.com/d2fc86be-40f8-4b16-9ea4-aead71bb4537%2Fwafflecone.PNG?v=1595873454870"
  );

  ellipseMode(CENTER);

  // button = createButton("RESTART")
  // button.position(20,20)
  player1ImageWidth = 70;
  player1ImageHeight = 100;
  lives = 3;
  score = 0;

  scoops = [];
  for (let i = 0; i < num_waffleCone; i++) {
    for (let x = 49; x < width; x += 75) {
      scoops.push(new IceCream(x));
    }
  }
} 

function draw() {
  // console.log(mouseX, mouseY);
  startScreen();
  menuDirections();
  checkWin();
  gameOver();
}

function startScreen() {
  background(255);
  image(startScreenImage, 140, 0, 550, 550);
  image(banner, 20, 20, 250, 50);
  fill("lightblue");
  rect(425, 340, 80, 30);
  fill("lightblue");
  rect(425, 390, 175, 35);
  
  textFont('Futura');
  textSize(20);
  fill("black");
  text("START", 433, 363);
  textSize(20);
  textStyle(BOLD);
  fill("black");
  text("INSTRUCTIONS", 433, 415);
}

function menuDirections() {
  if (menu == 1) {
    backgroundLayer();
    displayScores();
    textSize(100);
    text(timer, 10, 100);
    if (frameCount % 60 == 0 && timer > 0) {
      timer--;
    }
    if (timer == 0) {
      menu = 3;
    }

    image(
      player1Image,
      constrain(mouseX, 0 + player1ImageWidth, width - player1ImageWidth) -
        player1ImageWidth / 2,
      constrain(mouseY, 50, 300) - player1ImageHeight / 2,
      player1ImageWidth,
      player1ImageHeight
    );
    noFill();
    noStroke();
    rect(
      constrain(mouseX, 0 + player1ImageWidth, width - player1ImageWidth) -
        player1ImageWidth / 2,
      constrain(mouseY, 50, 300) - player1ImageHeight / 2,
      player1ImageWidth,
      player1ImageHeight
    );

    // for first level only
    if (
      level == 1 &&
      score == clearScoops &&
      levelScreenCounter < levelDisplayTime //levelScreenCounter = 0 and levelDisplayTime = 100
    ) {
      levelScreen(); // jump to line 336 for function
      levelScreenCounter++;
    }

    for (let i = 0; i < num_waffleCone; i++) {
      scoops[i].show();
      checkCollisions(scoops[i]);

      if (scoops[i].y < -40) {
        scoops[i].y = 395;
        scoops[i].counter = 0;
      }

      // when to move scoop
      if (scoops[i].y == 395 && scoops[i].counter < delayTime) {
        scoops[i].y += 0;
        scoops[i].counter++;
      } else {
        scoops[i].move();
      }

      if (score > 0 && score % 25 == 0) {
        level++;
        clearScoops += 25;
        levelScreen();
        menu = 4;
      }

      // if (displayTime) {
      //does this run infinitely?
      // levelScreenCounter = frameCount + levelDisplayTime;

      //         for (let i = 0; i < 100; i++) {
      //           if (levelScreenCounter < levelDisplayTime) {
      //             levelScreen();
      //             levelScreenCounter++;
      //             console.log(levelScreenCounter);

      //             if (levelScreenCounter == 99) {
      //               // displayTime = false;
      //               noLoop();
      //             }
      //           }
      //         }
    }
  }

  if (BackspaceIsPressed) {
    menu = 0;
  }

  // instructions for the game
  if (menu == 2) {
    background("black");
    fill(255);
    textFont('Futura');
    text("press backspace to return to menu", 170, 490);
    textSize(40);
    text("INSTRUCTIONS", 200, 80);
    
    textSize(20);
    text("- Dodge the ice cream scoops", 50, 140);
    text("- You will earn points when the scoops reach the top", 50, 180);
    text("- Move the character with your mouse to avoid getting hit", 50, 220);
    text("- You get 3 lives, game over when lives = 0", 50, 260);
    text("GOAL: reach 25 scoops in one minute", 50, 300);
    text("Created by Grace Zhang and Kristy Nhan ", 130, 380);
    text("from Cohort 16 of Google CSSI '20", 170, 410);


    if (BackspaceIsPressed) {
      menu = 0;
    }
  }

  if (menu == 3) {
    background(gameoverImage);
    restartButton = createButton("RESTART");
    restartButton.position(130, 400);
    restartButton.size(120, 35);
    restartButton.style("font-size", "20px");
    restartButton.style("font-family", "Futura");
    restartButton.style("background-color", "lightblue");
    restartButton.mousePressed(restart);
    exitButton = createButton("EXIT");
    exitButton.position(450, 400);
    exitButton.size(120, 35);
    exitButton.style("font-size", "20px");
    exitButton.style("font-family", "Futura");
    exitButton.style("background-color", "lightblue");
    exitButton.mousePressed(exit);
  }

  if (menu == 4) {
    background(265, 60, 100);
    imageMode(CENTER);
    image(winnerPage, 350, 200, 512, 341);
    restartButton = createButton("RESTART");
    restartButton.position(130, 400);
    restartButton.size(120, 35);
    restartButton.style("font-size", "20px");
    restartButton.style("font-family", "Futura");
    restartButton.style("background-color", "lightblue");
    restartButton.mousePressed(restart);
    exitButton = createButton("EXIT");
    exitButton.position(450, 400);
    exitButton.size(120, 35);
    exitButton.style("font-size", "20px");
    exitButton.style("font-family", "Futura");
    exitButton.style("background-color", "lightblue");
    exitButton.mousePressed(exit);
  }
}

function cones() {
  for (let xWaffle = 25; xWaffle < width; xWaffle += 75) {
    image(waffleCone, xWaffle, yWaffle, waffleWidth, waffleHeight);
  }
}

function backgroundLayer() {
  background(backgroundImage);
  cones();
}

class IceCream {
  constructor(x) {
    this.x = x;
    this.y = 395;
    this.mainSize = 50;
    this.counter = 0;
    this.yVelocity = random(-1, -0.25);

    //smaller circle diameter:
    this.subSize = 15;
  }

  //display the initial scoop on the screen
  show() {
    fill(0, 10, 100);
    noStroke();

    ellipse(this.x, this.y, this.mainSize, this.mainSize);
    ellipse(this.x - 18, this.y + 20, this.subSize, this.subSize);
    ellipse(this.x - 6, this.y + 20, this.subSize, this.subSize);
    ellipse(this.x + 6, this.y + 20, this.subSize, this.subSize);
    ellipse(this.x + 18, this.y + 20, this.subSize, this.subSize);
  }

  //ice cream will move up the screen with random velocity from -1 to -0.25
  move() {
    this.y += this.yVelocity;
    if (this.y < -40) {
      score++;
    }
  }
}

function keyPressed() {
  if (keyCode == BACKSPACE) {
    BackspaceIsPressed = true;
  }
}

function keyReleased() {
  if (keyCode == BACKSPACE) {
    BackspaceIsPressed = false;
  }
}

function mouseClicked() {
  if (menu == 0) {
    if (mouseX < 509 && mouseX > 425) {
      if (mouseY < 360 && mouseY > 340) {
        menu = 1;
      }
      if (mouseY < 425 && mouseY > 390) {
        menu = 2;
      }
    }
  }
}

function checkCollisions(scoop) {
  hit = collideRectCircle(
    constrain(mouseX, 0 + player1ImageWidth, width - player1ImageWidth) -
      player1ImageWidth / 2,
    constrain(mouseY, 50, 300) - player1ImageHeight / 2,
    player1ImageWidth,
    player1ImageHeight,
    scoop.x,
    scoop.y,
    scoop.mainSize
  );
  if (hit && frameCount > collisionWaitTime) {
    lives--, (collisionWaitTime = frameCount + 50);

    // for (const scoop of scoops) {
    // if (scoop.y < -40) {}
    //}
    for (let i = 0; i < num_waffleCone; i++) {
      scoops[i].y = 395;
      scoops[i].counter = 0;

      // when to move scoop
      if (scoops[i].y == 395 && scoops[i].counter < delayTime) {
        scoops[i].y += 0;
        scoops[i].counter++;
      } else {
        scoops[i].move();
      }
    }
  }
}

function displayScores() {
  fill("black");
  textSize(25);
  text(`lives = ${lives}`, 575, 30);
  text(`score = ${score}`, 565, 60);
  text("press backspace to return to menu", 230, 490);
}

// function increaseVelocity() {
//   for (let i = 0; i < num_waffleCone; i++) {
//     scoops[i].yVelocity += random(-2, -1);
//   }
// }

function levelScreen() {
  fill(0, 0, 100, 30);
  noStroke();
  ellipse(width / 2, height / 2, 550, 350);
  fill("black");
  textSize(40);
  text(`Get ready!`, 250, 230);
  text(`Clear ${clearScoops + 25} scoops`, 200, 290);
  
}

function gameOver() {
  if (lives == 0) {
    gameIsOver = true;
  }
  if (gameIsOver) {
    menu = 3;

    if (gameSound.isPlaying()) {
      gameSound.stop();
      gameoverSound.play();
    }
  }
}

function restart() {
  window.location.reload();
}

function exit() {
  window.close();
}

function checkWin() {
  if (score == 25) {
    menu = 4;
    if (gameSound.isPlaying()) {
      gameSound.stop();
      winnerSound.play();
    }
  }
}
