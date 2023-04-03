const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

class Block {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x * scale, this.y * scale, scale, scale);
    }
}

class Tetromino {
    constructor(x, y, shape, color) {
        this.x = x;
        this.y = y;
        this.shape = shape;
        this.color = color;
    }

    draw() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    new Block(this.x + col, this.y + row, this.color).draw();
                }
            }
        }
    }
}

const shapes = [
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 0],
    ],
];

const colors = [
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

let tetromino;
let gameInterval;

function startGame() {
    tetromino = new Tetromino(4, -1, shapes[Math.floor(Math.random() * shapes.length)], colors[Math.floor(Math.random() * colors.length)]);
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

function rotate(matrix) {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array(N).fill(0));

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            result[col][N - 1 - row] = matrix[row][col];
        }
    }
    return result;
}

function rotateTetromino() {
    const newShape = rotate(tetromino.shape);
    if (canMove(tetromino.x, tetromino.y, newShape)) {
        tetromino.shape = newShape;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tetromino.draw();
    }
}

function canMove(newX, newY, newShape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (newShape[row][col] && (
                // outside the game board
                newX + col < 0 ||
                newX + col >= columns ||
                newY + row >= rows ||
                // collides with another block
                // TODO: Add collision detection with existing blocks on the game board
                false
            )) {
                return false;
            }
        }
    }
    return true;
}

function moveLeft() {
    if (canMove(tetromino.x - 1, tetromino.y, tetromino.shape)) {
        tetromino.x--;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tetromino.draw
    }
}

function moveRight() {
    if (canMove(tetromino.x + 1, tetromino.y, tetromino.shape)) {
        tetromino.x++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tetromino.draw();
    }
}

const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0));

function addToBoard() {
    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col]) {
                gameBoard[tetromino.y + row][tetromino.x + col] = tetromino.color;
            }
        }
    }
}

function clearLines() {
    outer: for (let row = rows - 1; row >= 0;) {
        for (let col = 0; col < columns; col++) {
            if (!gameBoard[row][col]) {
                continue outer;
            }
        }

        // Remove the line
        gameBoard.splice(row, 1);
        gameBoard.unshift(Array(columns).fill(0));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    tetromino.draw();
}

function drawBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (gameBoard[row][col]) {
                new Block(col, row, gameBoard[row][col]).draw();
            }
        }
    }
}

function moveDown() {
    if (canMove(tetromino.x, tetromino.y + 1, tetromino.shape)) {
        tetromino.y++;
    } else {
        addToBoard();
        clearLines();
        if (tetromino.y < 0) {
            clearInterval(gameInterval);
            alert('Game Over!');
            return;
        }
        startGame();
    }
}

function startInterval() {
    gameInterval = setInterval(() => {
        moveDown();
        update();
    }, 1000);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        rotateTetromino();
    } else if (event.code === "ArrowLeft") {
        moveLeft();
    } else if (event.code === "ArrowRight") {
        moveRight();
    } else if (event.code === "ArrowDown") {
        moveDown();
    }
});

startGame();
startInterval();
gameLoop();
