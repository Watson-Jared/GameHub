// Get canvas and 2D drawing context
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// Initialize game variables
var points = 0
document.getElementById("Points").innerText = points



// Track highest score and pause state
var highestScore = 0;
var isPaused = false;

// Grid size and animation frame counter
var grid = 16;
var count = 0;

// Snake object - tracks position, direction, body segments
var snake = {
  x: 160,        // Starting X position
  y: 160,        // Starting Y position
  dx: grid,      // Direction velocity X
  dy: 0,         // Direction velocity Y
  cells: [],     // Array of body segment coordinates
  maxCells: 4    // Body length (grows when eating apples)
};
// Apple object - food for the snake
var apple = {
  x: 320,
  y: 320
};


// Generate random integer between min and max (for apple placement)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Update the high score display on the page
function updateScoreDisplay() {
  document.getElementById("scoreArray").innerText = highestScore;
}

// Main game loop - runs every frame
function loop() {
  requestAnimationFrame(loop);

  // Skip frame updates if game is paused
  if (isPaused) {
    return;
  }

  // Control game speed - increases as score increases
  var speedThreshold = Math.max(1, 6 - Math.floor(points / 10));
  if (++count < speedThreshold) {
    return;
  }

  // Clear canvas and reset frame counter
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);


  // Update snake position based on direction
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap snake around screen edges (X axis)
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }


  // Wrap snake around screen edges (Y axis)
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }


  // Add new head position to the front of the snake
  snake.cells.unshift({x: snake.x, y: snake.y});

  // Remove tail if snake is longer than maxCells
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }


  // Draw apple (food) - red square
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);


  // Draw snake - green squares
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    // Draw each body segment
    context.fillRect(cell.x, cell.y, grid-1, grid-1);


    // Check if snake ate the apple
    if (cell.x === apple.x && cell.y === apple.y) {
      points++  // Increment score
      document.getElementById("Points").innerText = points;
      snake.maxCells++;  // Grow snake

      // Generate new apple position
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }


    // Check if snake collided with itself
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        // Update high score if current score is higher
        if (points > highestScore) {
          highestScore = points;
          updateScoreDisplay();
        }

        // Reset score and snake
        points = 0
        document.getElementById("Points").innerText = points;
        

        // Reset snake to starting position and velocity
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        // Place apple at new random location
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}


// Pause/Resume button event listener
document.getElementById('pause').addEventListener('click', function() {
  isPaused = !isPaused;
  // Update button text based on pause state
  if (isPaused) {
    document.getElementById('pause').innerText = 'Resume';
  } else {
    document.getElementById('pause').innerText = 'Pause';
  }
});

// Back button - return to game hub
document.getElementById('back').addEventListener('click', function() {
  window.location.href = '../index.html';
});

// Handle arrow key input for snake direction
document.addEventListener('keydown', function(e) {
  // Left arrow (37) - move left if not moving right
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // Up arrow (38) - move up if not moving down
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // Right arrow (39) - move right if not moving left
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // Down arrow (40) - move down if not moving up
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});


requestAnimationFrame(loop);
