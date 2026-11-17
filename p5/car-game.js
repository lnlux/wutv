let game = {
        isAlive: true,
        score:0,

        distanceToEnemy: 0,

        centerX: 0, //  width / 2
        centerY: 0,  //  height / 2

        debug: {
            enabled: true,

            enemyLane:"dunno",
        },
};

let road = {
    width: 230,
    
    line: {
        x:0
    }
};

let player = {
    
    transform: {
        x: 50,      //Distance from left edge in px
        y: 0,       //Going to be centered in Setup()
        height: 90, 
        width: 120,
        lane: 0
    },

    movement: {
        turnSpeed: 0.5,
        speed:0
    },

    turnUp() {
        this.transform.y -= this.movement.turnSpeed * deltaTime;
    },

    turnDown() {    
        this.transform.y += this.movement.turnSpeed * deltaTime;
    },

    
    leftLane() {
        this.transform.lane = 0;
        this.transform.y = game.centerY-road.width/2;
    },
    
    rightLane() {
        this.transform.lane = 1;
        this.transform.y = game.centerY+road.width/2;
    }
};

let enemy = {
    
    transform: {
        x: 50,      //Distance from RIGHT edge in px AFTER Setup()
        y: 0,       //Going to be centered in Setup()
        height: 90, 
        width: 120,
        lane: 0,
    },

    movement: {     // No function
        turnSpeed: 0.5,
        targetSpeed:8,
        speed:0,
        isBraking:0
    },

    leftLane() {
        game.debug.enemyLane = "Left";  //debug info
        this.transform.lane = 0;
        
        this.transform.y = game.centerY-road.width/2;
    },

    rightLane() {
        game.debug.enemyLane = "Right";  //debug info
        this.transform.lane = 1;
    
        this.transform.y = game.centerY+road.width/2;
    }
};



function setup(){
    createCanvas(windowWidth, windowHeight)
    background(255,0,0);
    game.centerX = width/2;
    game.centerY = height/2;

    let d;

    player.transform.y = game.centerY;

    enemy.transform.x = width - enemy.transform.x - enemy.transform.width;

    enemy.transform.y = game.centerY;

    player.rightLane();
    enemy.leftLane();
}

function draw(){

    //Distance from enemy to player

    game.distanceToEnemy = dist(enemy.transform.x,enemy.transform.y,player.transform.x,player.transform.y);
    


    //Collision

    if(player.transform.lane === enemy.transform.lane && game.distanceToEnemy < player.transform.width/2 + enemy.transform.width/2 && enemy.transform.x > player.transform.x){
        enemy.transform.x=player.transform.x+player.transform.width;
        enemy.movement.speed=-player.movement.speed*2;
        player.movement.speed=-0.05;
        game.isAlive=false;
    }

    if(game.isAlive===false){
        player.movement.speed *= 0.99;
    }




    
    // Basic Enemy A.I
    if (
        player.transform.lane === enemy.transform.lane &&
        game.distanceToEnemy < 1000 &&
        enemy.transform.x > player.transform.x
    ) {
        enemy.movement.isBraking = 1;
        enemy.movement.speed *= 0.98;
    } else {
        enemy.movement.isBraking = 0;
    }

    if (enemy.movement.speed < enemy.movement.targetSpeed && enemy.movement.isBraking === 0) {
        enemy.movement.speed += 0.025;
    }

    

    





    //Move Forward
    if(player.movement.speed>0){
    game.score += player.movement.speed;
    }

    enemy.transform.x -= enemy.movement.speed + player.movement.speed*deltaTime;
    road.line.x -= player.movement.speed*deltaTime;

    if(player.movement.speed <= 0.01 && player.movement.speed >= -0.01){
        player.movement.speed = 0;
    }

    if(road.line.x <= 0-width/2 || road.line.x >= width/2){
        road.line.x = 0;
    }



    //Move Forward  -   Enemy Spawning
    if(enemy.transform.x <= 0-enemy.transform.width*2){
        enemy.transform.x = width*2;

        if(random(0, 1) <= 0.5){
            enemy.leftLane();
        } else{
            enemy.rightLane();
        }
    }



    //Input WASD

    //
    //  Lies in KeyPressed() Function
    //  
    //  W,S
    //
    //
    if(game.isAlive==true){
        if(keyIsDown("d")){
            player.movement.speed += 0.001 * deltaTime;
        }

        if(keyIsDown("a")){
            player.movement.speed -= 0.001 * deltaTime;
        }

        if(keyIsDown(" ")){
            player.movement.speed *= 0.9;
        }
    }



    //Grass
    background(85, 164, 37);




    textAlign(LEFT);

    //Score
    fill(255);
    textSize(20);
    text("Score: " + round(game.score), 20,40);

    //Speed
    fill(255);
    textSize(20);
    text("Speed: " + round(player.movement.speed, 1), 20,80);

    //debug text
    if(game.debug.enabled){
    fill(255,255,0)
    textSize(40);
    textAlign(RIGHT);
    text("DEBUG",width-40,80);
    textSize(20);
    text("Enemy Lane: " + game.debug.enemyLane, width-225, 80);
    text("Distance to enemy: " + round(game.distanceToEnemy), width-225, 100);
    text("Enemy Braking " + enemy.movement.isBraking, width-225, 120);
    
    
    }



    //Road
    noStroke();
    fill(60);
    rect(0,game.centerY-road.width,width,road.width*2);

    //Road Line 
    stroke(255);
    strokeWeight(2);

    line(road.line.x    - 1*(width/4)           ,game.centerY,          road.line.x-2*(width/4)   ,game.centerY);

    line(road.line.x    ,game.centerY,          road.line.x+(width/4)   ,game.centerY);

    line(road.line.x    + 2*(width/4)           ,game.centerY,          road.line.x+3*(width/4)   ,game.centerY);

    line(road.line.x    + 4*(width/4)           ,game.centerY,          road.line.x+5*(width/4)   ,game.centerY);
    noStroke();

    // Player
    fill(40, 85, 180);
    rect(player.transform.x, player.transform.y - player.transform.height / 2, player.transform.width, player.transform.height);

    // Passing Car
    fill(180, 10, 50);
    rect(enemy.transform.x, enemy.transform.y - enemy.transform.height / 2, enemy.transform.width, enemy.transform.height);



    //debug

    if(game.debug.enabled){
    fill(255,0,0);
    circle(game.centerX,game.centerY,10);

    fill(0,255,0);
    circle(game.centerX-width/4 ,game.centerY,10);

    fill(0,0,255);
    circle(game.centerX+width/4 ,game.centerY,10);
    }

}


function keyPressed(){
    if(game.isAlive===true){
        if(key === "w"){
            player.leftLane();
        }

        if(key === "s"){
            player.rightLane();
        }
    }
}