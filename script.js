// Define HTML elements
const boardEl = document.getElementById("game-board");
const instructionEl = document.getElementById("instruction");
const logoEl = document.getElementById("logo");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "up";
let gameInterval;
let gameSpeedDelay = 200;
let gameStart = false;

//Draw game map,snake,food.
function draw() {
    boardEl.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

//Draw Snake function
function drawSnake() {
    snake.forEach((segment) => {
        const snakeEl = createGameElement('div', 'snake');
        setPosition(snakeEl, segment);
        boardEl.appendChild(snakeEl);
    });
}

//Create a snake or food div
function createGameElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

//Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Draw Food
function drawFood() {
    if(gameStart){
        const foodEl = createGameElement('div', 'food');
        setPosition(foodEl, food);
        boardEl.appendChild(foodEl);
    }
    
}

//Generating Food Randomly on game board
function generateFood() {
    let newFood;
    do {
        const x = Math.floor(Math.random() * gridSize) + 1;
        const y = Math.floor(Math.random() * gridSize) + 1;
        newFood = { x, y };
    } while (isSnakeAtPosition(newFood)); 

    return newFood;
}

function isSnakeAtPosition(position) {
    return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}


//Moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case "right":
            head.x++;
            break;
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        clearInterval(gameInterval );
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}


//Start Game Function
function startGame() {
    gameStart = true; // Keep track of a running game
    instructionEl.style.display = "none";
    logoEl.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//Create a keypress event listener
function handleKeyPress(event) {
    if (
        (!gameStart && event.code === "Space") ||
        (!gameStart && event.code === "")
    ) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                if(direction !== 'down'){
                    direction = 'up';
                }
                
                break;
            case "ArrowDown":
                if(direction !== 'up'){
                    direction = 'down';
                }
                break;
            case "ArrowLeft":
                if(direction !== 'right'){
                    direction = 'left';
                }
                break;
            case "ArrowRight":
                if(direction !== 'left'){
                    direction = 'right';
                }
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

//Checking For Collisions
function checkCollision(){
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize  || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let i = 1; i <snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

//Restarting Game after collisions
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10,y:10}];
    food = generateFood();
    direction = 'right'
    gameSpeedDelay= 200;
    updateScore();
    

}

//Updating Score
function updateScore(){
    const currentScore = snake.length - 1;
    scoreEl.textContent = currentScore.toString().padStart(3, '0');
}

//Stopping Game after collision
function stopGame(){
    clearInterval(gameInterval)
    gameStart = false;
    instructionEl.style.display = 'block';
    logoEl.style.display = 'block';
}

//Updating High Score after collision
function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreEl.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreEl.style.display = 'block';
}