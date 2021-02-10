
let thingsToLoad = [
  "audio/chimes.wav",
  "img/sss.json"
];
let g = hexi(512, 512, setup, thingsToLoad);

g.scaleToWindow('lightgreen');

let dungeon, player, treasure, enemies, chimes, exit,
  healthBar, message, gameScene, gameOverScene, score;



function setup(){
  dungeon = g.sprite("dungeon.png");

  chimes = g.sound("audio/chimes.wav");
  gameScene = g.group();
  exit = g.sprite("door.png");
  exit.x = 32;
  
  gameScene.addChild(exit);

  player = g.sprite("explorer.png");
  player.x = 68;
  player.y = g.canvas.height / 2 - player.halfHeight;
  gameScene.addChild(player);

  arreyTreasure =[]
  for(let i = 0; i< 5; i++){
    treasure = g.sprite("treasure.png");
    treasure.x = g.canvas.width - treasure.width - 16 - 10 * i;
    treasure.y = g.canvas.height / 2 - (treasure.halfHeight - 16) * i;
    treasure.pickedUp = false;
    arreyTreasure.push(treasure)
    gameScene.addChild(treasure);
  }

  score = 0;

  let numberOfEnemies = 6,
    spacing = 48,
    xOffset = 150,
    speed = 2,
    direction = 1;

  enemies = [];
  for (let i = 0; i < numberOfEnemies; i++) {
    let enemy = g.sprite("blob.png");
    
    let x = spacing * i + xOffset;
    let y = g.randomInt(0, g.canvas.height - enemy.height);

    enemy.x = x;
    enemy.y = y;
    enemy.vy = speed * direction;

    direction *= -1;

    enemies.push(enemy);
    gameScene.addChild(enemy);
  }
    let outerBar = g.rectangle(128, 16, "black"),
      innerBar = g.rectangle(128, 16, "yellowGreen");
    healthBar = g.group(outerBar, innerBar);
    healthBar.inner = innerBar;
    healthBar.x = g.canvas.width - 148;
    healthBar.y = 16;
    
    gameScene.addChild(healthBar);

    message = g.text("Game Over!", "48px Futura", "black", 20, 20);
    message.x = 120;
    message.y = g.canvas.height / 2 - 64;
    
    gameOverScene = g.group(message);
    gameOverScene.visible = false;

    g.arrowControl(player, 5);
  


  g.state = play;
}
function play(){
  g.move(player);
  g.contain(player, {
    x:32, y: 16,
    width: g.canvas.width - 32,
    height: g.canvas.height - 32,
  });

  playerAndEnemy();
  getTreasure();
  isFinish();
}
function isFinish(){
  if (healthBar.inner.width <= 0) {
    g.state = end;
    message.content = "You lost!";
  }
  arreyTreasure.forEach(treasure => {
    if (g.hitTestRectangle(treasure, exit)) {
    g.state = end;
    message.content = `You won! score: ${score}`;
  }
  })
  
}
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
function playerAndEnemy(){
  let playerHit = false;

  enemies.forEach(enemy => {
    g.move(enemy);
    let enemyHitsEdges = g.contain(enemy, {
      x: 32, y: 16,
      width: g.canvas.width - 32,
      height: g.canvas.height - 32,
    });

    if (enemyHitsEdges) {
      if (enemyHitsEdges.has("top") || enemyHitsEdges.has("bottom")) {
        enemy.vy *= -1;
      }
    }
    if (g.hitTestRectangle(player, enemy)) {
      playerHit = true;
    }
  });
  if(playerHit){
    player.alpha = 0.5;

    healthBar.inner.width -= 1;

  }else {
    player.alpha = 1;
  }
}
function getTreasure(){
  arreyTreasure.forEach(treasure => {
    if (g.hitTestRectangle(player, treasure)) {
      treasure.x = player.x + 8;
      treasure.y = player.y + 8;
      if (!treasure.pickedUp) {
        chimes.play();
        score++;
        treasure.pickedUp = true;
      };
    }
  })
  
}
g.start();


