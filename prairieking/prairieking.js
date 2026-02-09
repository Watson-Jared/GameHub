var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var points = 0
document.getElementById("Points").innerText = points

var highestScore = 0;
var isPaused = false;

var grid = 16;
var count = 0;


document.getElementById('back').addEventListener('click', function() {
  window.location.href = '../games.html';
});