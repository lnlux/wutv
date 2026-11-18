let game = {
        isPaused: false,
        isAlive: true,
        score:0,
        money:100000,

        pauseColor:0,

        distanceToEnemy: 0,

        centerX: 0, //  width / 2
        centerY: 0,  //  height / 2

        camera: {
            xOffset:0
        },

        debug: {
            enabled: true,
            autoLane: true,
            godMode: false,

            enemyLane:"if your reading this, something went terribly wrong",
        },

        pause(){
            switch(this.isPaused){
                case true:
                    this.isPaused=false;
                    break;
                case false:
                    this.isPaused=true;
                    break;
            }   
        }
};

let road = {
    width: 150,
    
    line: {
        x:0
    }
};

let player = {

    engine: {
        slow:0,
        rpm:0,
        maxRpm:3000,
        power:10,
        fuel:100
    },
    
    transform: {
        x: 50,      //Distance from left edge in px
        y: 0,       //Going to be centered in Setup()
        height: 90, 
        width: 120,
        lane: 0
    },

    movement: {
        turnSpeed: 0.5,
        acceleration:0.001,

        currentAction:"none", //"accel", "braking"

        speedPrevFrame:0,
        GforceNowX:0,
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

    appearance: {
        
    },
    
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
        acceleration:0.025,
        isBraking:0
    },

    leftLane() {
        game.debug.enemyLane = "Left";  //debug info
        this.transform.lane = 0;
        
        this.transform.y = game.centerY-road.width/2;

        if(game.debug.autoLane && game.debug.enabled){player.rightLane();}
    },

    rightLane() {
        game.debug.enemyLane = "Right";  //debug info
        this.transform.lane = 1;
    
        this.transform.y = game.centerY+road.width/2;

        if(game.debug.autoLane && game.debug.enabled){player.leftLane();}
    }
};

let shop = {
    visible:false,

    items: {
        fuel: {
            cost:40,
            amount:50
        },

        rpm: {
            cost:150,
            amount:500
        },

        power: {
            cost:400,
            amount:5
        },


    },

    buy: {
        fuel(){
            if(game.money > shop.items.fuel.cost){
                game.money -= shop.items.fuel.cost;
                player.engine.fuel += shop.items.fuel.amount;
            }
        },

        rpm(){
            game.money -= shop.items.rpm.cost;
            player.engine.maxRpm += shop.items.rpm.amount;
        },

        power(){
            game.money -= shop.items.power.cost;
            player.engine.power += shop.items.power.amount;
        },
    }

};

function setup(){
    createCanvas(windowWidth, windowHeight)
    background(255,0,0);
    game.centerX = width/2;
    game.centerY = height/2;


    player.transform.y = game.centerY;

    enemy.transform.x = width - enemy.transform.x - enemy.transform.width;

    enemy.transform.y = game.centerY;

    player.rightLane();
    enemy.leftLane();
}


function reset(){
    game.isAlive=true;
    game.isPaused=false;

    game.score=0;
    game.money=0;
    game.camera.xOffset=0;

    player.engine.fuel=100;
    player.engine.maxRpm=3000;
    player.engine.power=10;

    road.line.x=0;

    player.transform.x=50;
    player.rightLane();
    enemy.leftLane();

    player.movement.speed=0;
    player.engine.rpm=0;

    enemy.movement.speed=0;
    enemy.transform.x = width - 50 - enemy.transform.width;
    
}

function keyPressed(){

    //Pause / Restart
    if(key === ESCAPE){
        if(game.isAlive===true){
            game.pause();
        }else{reset();}
    }

    //Change Langes
    if(game.isAlive===true && game.isPaused===false){
        if(key === "w" || key === "W"){
            player.leftLane();
        }
        if(key === "s" || key === "S"){
            player.rightLane();
        }   
    }

    //Shop
    //Number keys for shop item
    if(shop.visible){
        if(key==="1"){
            shop.buy.fuel();
        }

        if(key==="2"){
            shop.buy.rpm();
        }

        if(key==="3"){
            shop.buy.power();
        }
    }


}


function draw(){


    //Engine
    //RPM calc
    if(player.movement.currentAction === "accel"){
        player.engine.rpm = constrain(player.engine.rpm+player.engine.power,0,player.engine.maxRpm);
    }

    if(player.movement.currentAction === "none"){
        player.engine.rpm = constrain(player.engine.rpm-player.engine.power/1.5,0,player.engine.maxRpm);    
    }

    if(player.movement.currentAction === "brake"){
        player.engine.rpm = constrain(player.engine.rpm-player.engine.power*2,0,player.engine.maxRpm);    
    }

    if(player.movement.currentAction === "handbrake"){
        player.engine.rpm = constrain(player.engine.rpm-player.engine.power*10,0,player.engine.maxRpm);  
    }

    if(player.engine.rpm > player.engine.maxRpm){
        player.engine.rpm = player.engine.maxRpm;
    }


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
    if(game.isPaused===false){
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
            enemy.movement.speed += enemy.movement.acceleration;
        }

    }

    





    //Move Forward
    if(game.isPaused===false){

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
        if(enemy.transform.x <= 0-enemy.transform.width+5){

            game.money += player.movement.speed;

            enemy.transform.x = width*2;

            if(random(0, 1) <= 0.5){
                enemy.leftLane();
            } else{
                enemy.rightLane();
            }
        }

    }

    //Input WASD    -   Player Speed Stuff

    //  W and S
    //  is in KeyPressed() Function
    //  
    if(game.isAlive==true && game.isPaused == false){
        if(keyIsDown("d") || keyIsDown("D")){
            player.movement.currentAction="accel";
            player.engine.fuel-=deltaTime/1000  *   player.engine.rpm / player.engine.maxRpm;
        }else if(keyIsDown("a") || keyIsDown("S")){
            player.movement.currentAction="brake";
            player.movement.speed *= 0.95-player.engine.power/100;
        }else if(keyIsDown(" ")){
            player.movement.currentAction="handbrake";
            player.movement.speed *= 0.9 - player.engine.power/80; 
        }else {
            player.movement.currentAction="none";
        }

        player.movement.speed = (player.engine.rpm * player.engine.power) / 10000;
    }



    //Acceleration effect


    //Grass
    background(85, 164, 37);



    //Road
    noStroke();
    fill(60);
    rect(0,game.centerY-road.width,width,road.width*2);

    //Road Line 
    stroke(255);
    strokeWeight(2);

    line(road.line.x    - 1*(width/4)   +game.camera.xOffset           ,game.centerY,          road.line.x-2*(width/4)  +game.camera.xOffset   ,game.centerY);

    line(road.line.x     +game.camera.xOffset    ,game.centerY,          road.line.x+(width/4    +game.camera.xOffset)   ,game.centerY);

    line(road.line.x    + 2*(width/4)    +game.camera.xOffset           ,game.centerY,          road.line.x+3*(width/4)  +game.camera.xOffset   ,game.centerY);

    line(road.line.x    + 4*(width/4)    +game.camera.xOffset           ,game.centerY,          road.line.x+5*(width/4)  +game.camera.xOffset   ,game.centerY);
    noStroke();

    // Player
    fill(40+ player.engine.rpm/player.engine.maxRpm*200, 85-player.engine.rpm/player.engine.maxRpm*80, 180-player.engine.rpm/player.engine.maxRpm*170);
    rect(player.transform.x  +game.camera.xOffset, player.transform.y - player.transform.height / 2, player.transform.width, player.transform.height);

    // Passing Car
    fill(255,200,100)
    rect(enemy.transform.x   +game.camera.xOffset, enemy.transform.y - enemy.transform.height / 2, enemy.transform.width, enemy.transform.height);

    textAlign(CENTER);

    //Score
    fill(255);
    textSize(20);
    text("Score", game.centerX,40);
    textSize(50);
    text(round(game.score), game.centerX,100);

    textAlign(LEFT);

    //Speed
    textAlign(CENTER)
    fill(255);
    textSize(15);
    text("Speed", game.centerX-150,30);
    textSize(30);
    text(round(player.movement.speed,1),    game.centerX-120,80);

    //RPM
    textAlign(CENTER)
    fill(255);
    textSize(15);
    text("RPM", game.centerX+150,30);
    textSize(30);
    text(round(player.engine.rpm),    game.centerX+120,80);

    //Fuel
    textAlign(CENTER)
    fill(255);
    textSize(15);
    text("Fuel", game.centerX,150);
    textSize(30);
    text(round(player.engine.fuel,2),    game.centerX,180);

        //Money
        textAlign(LEFT);
        fill(155,255,155);
        textSize(20);
        text("Money: " + round(game.money), 20,40);





    //SHOP

    if(player.movement.speed<0.01 && game.isAlive && game.isPaused === false){shop.visible=true} else{shop.visible=false}
    if(shop.visible){

        /*
            Shop dimensions

            Width: 500
            Height: 400
        
        */

        fill(0,225);
        rect(game.centerX-250,game.centerY-200,500,400);

        fill(255);
        textSize(30);
        textStyle(ITALIC);
        textAlign(CENTER);
        text("Shop",game.centerX,game.centerY-160);

        /*

        Add:

        RPM Limit upgrade
        Fuel
        Power Upgrade   

        */

        
        textSize(17);
        textStyle(NORMAL);

        //Fuel
        
        if(game.money>=shop.items.fuel.cost){fill(255);}else{fill(55);}
        textAlign(LEFT);
        text("1. Fuel " + shop.items.fuel.amount + "L",game.centerX-200,game.centerY-100);
        textAlign(RIGHT);
        text("$" + shop.items.fuel.cost, game.centerX+   200,game.centerY-100)
        

        //RPM

        if(game.money>=shop.items.rpm.cost){fill(255);}else{fill(55);}

        textAlign(LEFT)
        text("2. Higher RPM +" + shop.items.rpm.amount,game.centerX-200,game.centerY-80);
        textAlign(RIGHT);
        text("$" + shop.items.rpm.cost, game.centerX+   200,game.centerY-80)


        //Power

        if(game.money>=shop.items.power.cost){fill(255);}else{fill(55);}

        textAlign(LEFT);
        text("3. Power +" + shop.items.power.amount,game.centerX-200,game.centerY-60);
        textAlign(RIGHT);
        text("$" + shop.items.power.cost, game.centerX+   200,game.centerY-60)
        




        //Money
        textAlign(LEFT);
        fill(155,255,155);
        textSize(20);
        text("$" + round(game.money), game.centerX-220,game.centerY-160);





        textAlign(CENTER);
        fill(255);
        textSize(15);
        text("- Shop is open when you are stationary -",game.centerX,game.centerY+190);






    }

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
        text("deltaTime: " + round(deltaTime,1), width-225,140);
        text("Engine RPM: " + round(player.engine.rpm), width-225,160);
        text("Engine Power: " + round(player.engine.power), width-225,180);
        text("Car Fuel: " + round(player.engine.fuel), width-225,200);
        text("PlayerAction: " + player.movement.currentAction, width-225,220);
        
    
    }






    //PAUSE
    if(game.isPaused===true && game.isAlive){
        fill(0,0,0,200);
        rect(0,0,width);

        fill(255);

        textAlign(CENTER);

        textSize(100);
        text("Pause", game.centerX,game.centerY-height/4);

        textSize(25);
        text("Press ESC to resume", game.centerX,game.centerY-height/4+100);
    }

    //Game Over Screen
    if(game.isAlive === false){
        fill(0,0,0,200);
        rect(0,0,width);

        fill(255);

        textAlign(CENTER);

        textSize(100);
        text("gg", game.centerX,game.centerY-height/4);

        textSize(25);
        text("Score: " + round(game.score), game.centerX,game.centerY-height/4+100);
        text("Press ESC to restart", game.centerX,game.centerY-height/4+500);
    }

    //debug circles

    /*if(game.debug.enabled){
        fill(255,0,0);
        circle(game.centerX,game.centerY,10);

        fill(0,255,0);
        circle(game.centerX-width/4 ,game.centerY,10);

        fill(0,0,255);
        circle(game.centerX+width/4 ,game.centerY,10);
        }
    */
    }
        
