let x = 0;

function setup() {
  createCanvas(windowWidth, windowHeight  );
}

function draw() {
  x+= 0.06*deltaTime;

  background(0);
  fill(255);
  circle(5+x*0.7,5,5);
  circle(5+x*0.8,10,5);
  circle(5+x*0.9,15,5);
  circle(5+x,20,5);
}
