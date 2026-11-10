let catX;
let catY; 
let catSize = 75;
let catSizeNow;

let catColor = "Crimson";
let catColorNow;
let catColorEnlarged = "Red";

// We replace the linear speed with a progress tracker for the ease curve
let shrinkProgress = 1; 
let shrinkDuration = 0.005; // Change this to alter speed (smaller = slower shrink)

let catSpeed = 10;

let mouseSize = 40;
let mouseSpeed = 4;

let catched = false;

let d;

let domainExpCoolDown = 5;
let domainExpSize = 550;

let musX = 0;
let musY = 0;

let gameState = "START";

function setup() {
  createCanvas(windowWidth, windowHeight);


  catX = random(0 , width);
  catY = random(0 , height);

  catSizeNow = catSize;
  catColorNow = catColor;
}

function draw() {
  background(22);

  if (gameState === "START") {
    //Cat
    stroke("white");
    fill(0, 0, 0, 0);
    noStroke();
    circle(catX, catY, catSizeNow);

    fill("red");
    text("KATTEN OCH MUSEN", width / 2, height / 2);
    textSize(20);
    textAlign(CENTER);
    text("TRYCK PÅ SPACE FÖR ATT STARTA", width / 2, 2*height/3);
    textSize(50);

  } else if (gameState === "PLAY") {
    musX = mouseX;
    musY = mouseY;

    catX = constrain(catX, catSize / 2, width - catSize / 2);
    catY = constrain(catY, catSize / 2, height - catSize / 2);

    musX = constrain(musX, mouseSize / 2, width - mouseSize / 2);
    musY = constrain(musY, mouseSize / 2, height - mouseSize / 2);

    if (catched === true) {
      fill("orange");
      textSize(30);
      textAlign(CENTER);
      text("KATTEN FÅNGADE MUSEN!", width / 2, height / 2);
    }

    // --- NEW EASED SHRINKING PART ---
    if (shrinkProgress < 1) {
      catColorNow = catColorEnlarged;
      
      // 1. Advance the timeline progress from 0 to 1
      shrinkProgress += shrinkDuration;
      shrinkProgress = constrain(shrinkProgress, 0, 1);
      
      // 2. Calculate the Ease-Out Quad curve modifier
      let easedT = shrinkProgress * (2 - shrinkProgress);
      
      // 3. Map it smoothly from the peak size down to the original size
      catSizeNow = map(easedT, 0, 1, domainExpSize, catSize);
    } else {
      // Fully reset when the timeline hits 1.0 (100% finished)
      catSizeNow = catSize;
      catColorNow = catColor;
    }
    // ---------------------------------

    if (keyIsDown("a")) {
      catX = catX - catSpeed;
    }
    if (keyIsDown("d")) {
      catX = catX + catSpeed;
    }
    if (keyIsDown("w")) {
      catY = catY - catSpeed;
    }
    if (keyIsDown("s")) {
      catY = catY + catSpeed;
    }

    d = dist(catX, catY, musX, musY);

    if (d < (catSizeNow / 2 + mouseSize / 2)) {
      gameState = "GAMEOVER";
    }

    //Mouse
    fill("white");
    circle(musX, musY, mouseSize);

    //Cat Expansion Range Indicator
    stroke("white");
    fill(0, 0, 0, 0);
    circle(catX, catY, domainExpSize);
    noStroke();

    //Actual Cat
    fill(catColorNow);
    circle(catX, catY, catSizeNow);

  } else if (gameState === "GAMEOVER") {
    text("GAMEOVER", width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode === 32) {
    gameState = "PLAY";
  } 

  if (key === "q") {
    // Only trigger if the cat isn't currently mid-shrink
    if (shrinkProgress >= 1) {
      shrinkProgress = 0; // Set timeline progress back to the beginning
    }
  }
}
