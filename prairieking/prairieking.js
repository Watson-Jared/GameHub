var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var points = 0;
var highScore = localStorage.getItem('prairieKingHighScore') || 0;
document.getElementById("Points").innerText = points;
document.getElementById("scoreArray").innerText = highScore;

var isPaused = false;
var gameRunning = true;

var character = {
  x: 200,
  y: 200,
  width: 20,
  height: 20,
  direction: 'right',
  speed: 2
};

var bullets = [];
var enemies = [];
var bulletCooldownCounter = 0;

var keys = {};

document.getElementById('back').addEventListener('click', function() {
  window.location.href = '../index.html';
});

document.getElementById('pause').addEventListener('click', function() {
  isPaused = !isPaused;
  if (isPaused) {
    document.getElementById('pause').innerText = 'Resume';
  } else {
    document.getElementById('pause').innerText = 'Pause';
  }
});

// Keyboard input
document.addEventListener('keydown', function(e) {
  keys[e.key.toLowerCase()] = true;
  
  // Arrow keys and WASD for direction
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
    character.direction = 'left';
  } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
    character.direction = 'right';
  } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
    character.direction = 'up';
  } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
    character.direction = 'down';
  }
  
  // Space to shoot
  if (e.key === ' ') {
    shoot();
  }
});

document.addEventListener('keyup', function(e) {
  keys[e.key.toLowerCase()] = false;
});

// Shoot bullet in character's facing direction
function shoot() {
  if (bulletCooldownCounter > 0) return;
  
  var bullet = {
    x: character.x + character.width / 2,
    y: character.y + character.height / 2,
    width: 5,
    height: 5,
    speed: 7,
    direction: character.direction
  };
  bullets.push(bullet);
  bulletCooldownCounter = 15;
}

// Spawn enemy at random edge
function spawnEnemy() {
  var edge = Math.floor(Math.random() * 4);
  var enemy = {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    speed: 0.8 + (points * 0.05)
  };
  
  if (edge === 0) { // Top
    enemy.x = Math.random() * canvas.width;
    enemy.y = 0;
  } else if (edge === 1) { // Right
    enemy.x = canvas.width;
    enemy.y = Math.random() * canvas.height;
  } else if (edge === 2) { // Bottom
    enemy.x = Math.random() * canvas.width;
    enemy.y = canvas.height;
  } else { // Left
    enemy.x = 0;
    enemy.y = Math.random() * canvas.height;
  }
  
  enemies.push(enemy);
}

// Move character
function moveCharacter() {
  if (keys['arrowleft'] || keys['a']) {
    character.x -= character.speed;
    character.direction = 'left';
  }
  if (keys['arrowright'] || keys['d']) {
    character.x += character.speed;
    character.direction = 'right';
  }
  if (keys['arrowup'] || keys['w']) {
    character.y -= character.speed;
    character.direction = 'up';
  }
  if (keys['arrowdown'] || keys['s']) {
    character.y += character.speed;
    character.direction = 'down';
  }
  
  // Keep character in bounds
  if (character.x < 0) character.x = 0;
  if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
  if (character.y < 0) character.y = 0;
  if (character.y + character.height > canvas.height) character.y = canvas.height - character.height;
}

// Update bullets
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    var bullet = bullets[i];
    
    if (bullet.direction === 'left') {
      bullet.x -= bullet.speed;
    } else if (bullet.direction === 'right') {
      bullet.x += bullet.speed;
    } else if (bullet.direction === 'up') {
      bullet.y -= bullet.speed;
    } else if (bullet.direction === 'down') {
      bullet.y += bullet.speed;
    }
    
    // Remove bullet if out of bounds
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(i, 1);
    }
  }
}

// Update enemies
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    var enemy = enemies[i];
    
    // Move towards character
    var dx = character.x - enemy.x;
    var dy = character.y - enemy.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      enemy.x += (dx / distance) * enemy.speed;
      enemy.y += (dy / distance) * enemy.speed;
    }
  }
}

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Check bullet-enemy collisions
function checkCollisions() {
  // Check bullet-enemy collisions
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (checkCollision(bullets[i], enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        points++;
        document.getElementById("Points").innerText = points;
        if (points > highScore) {
          highScore = points;
          localStorage.setItem('prairieKingHighScore', highScore);
          document.getElementById("scoreArray").innerText = highScore;
        }
        break;
      }
    }
  }
  
  // Check character-enemy collisions
  for (let i = 0; i < enemies.length; i++) {
    if (checkCollision(character, enemies[i])) {
      restartGame();
    }
  }
}

// Draw character
function drawCharacter() {
  context.fillStyle = '#0000ff';
  context.fillRect(character.x, character.y, character.width, character.height);
  
  // Draw direction indicator
  context.fillStyle = '#ffff00';
  var indicatorSize = 3;
  if (character.direction === 'right') {
    context.fillRect(character.x + character.width - 5, character.y + character.height / 2 - indicatorSize, 5, indicatorSize * 2);
  } else if (character.direction === 'left') {
    context.fillRect(character.x, character.y + character.height / 2 - indicatorSize, 5, indicatorSize * 2);
  } else if (character.direction === 'up') {
    context.fillRect(character.x + character.width / 2 - indicatorSize, character.y, indicatorSize * 2, 5);
  } else if (character.direction === 'down') {
    context.fillRect(character.x + character.width / 2 - indicatorSize, character.y + character.height - 5, indicatorSize * 2, 5);
  }
}

// Draw bullets
function drawBullets() {
  context.fillStyle = '#ffff00';
  for (let i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Draw enemies
function drawEnemies() {
  context.fillStyle = '#ff0000';
  for (let i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

// Restart game
function restartGame() {
  points = 0;
  character.x = 200;
  character.y = 200;
  character.direction = 'right';
  bullets = [];
  enemies = [];
  bulletCooldownCounter = 0;
  enemySpawnCounter = 0;
  document.getElementById("Points").innerText = points;
}

// Main game loop
var enemySpawnCounter = 0;
function gameLoop() {
  if (!isPaused) {
    // Update
    moveCharacter();
    updateBullets();
    updateEnemies();
    checkCollisions();
    
    // Decrease bullet cooldown
    if (bulletCooldownCounter > 0) bulletCooldownCounter--;
    
    // Spawn enemies - faster as points increase
    var spawnThreshold = Math.max(50, 150 - points * 0.5);
    enemySpawnCounter++;
    if (enemySpawnCounter > spawnThreshold) {
      spawnEnemy();
      enemySpawnCounter = 0;
    }
  }
  
  // Clear canvas
  context.fillStyle = '#af8a53';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw all elements
  drawCharacter();
  drawBullets();
  drawEnemies();
  
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();