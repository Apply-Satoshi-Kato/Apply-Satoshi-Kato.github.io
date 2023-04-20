const colors = [
    '#FFFF33', // Square shape
    '#66FF33', // S shape
    '#FF3366', // Z shape
    '#FF9900', // L shape
    '#0066FF', // J shape
    '#CC66FF', // T shape
    '#66FFCC', // I shape
];

const shapes = [
    // Square shape
    [[
        [1, 1],
        [1, 1],
    ], [
        [1, 1],
        [1, 1],
    ], [
        [1, 1],
        [1, 1],
    ], [
        [1, 1],
        [1, 1],
    ],],
    // S shape
    [[
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ], [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],],
    // Z shape
    [[
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
    ], [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
    ],],
    // L shape
    [[
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ], [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ], [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
    ],],
    // J shape
    [[
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ], [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ], [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ], [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],],
    // T shape
    [[
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ], [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
    ], [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ], [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],],
    // I shape
    [[
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ], [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ], [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ], [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],],
];

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

class Block {
    constructor(x, y, color, isGhost = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isGhost = isGhost;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.isGhost ? 0.3 : 1;
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x * scale, this.y * scale, scale, scale);
        ctx.globalAlpha = 1;
    }
}

class Tetromino {
    constructor(x, y, shapeIndex, color) {
        this.x = x;
        this.y = y;
        this.shapeIndex = shapeIndex;
        this.color = color;
        this.rotationIndex = 0;
    }

    get shape() {
        return shapes[this.shapeIndex][this.rotationIndex];
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

    rotate() {
        const newRotationIndex = (this.rotationIndex + 1) % 4;
        const newShape = shapes[this.shapeIndex][newRotationIndex];
        const offsetX = canMoveWithOffset(this.x, this.y, newShape);

        if (offsetX !== null) {
            this.rotationIndex = newRotationIndex;
            this.x += offsetX;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();
        }
    }
}

let tetromino;
let gameInterval;

let linesClearedCount = 0;
const linesClearedDisplay = document.getElementById("lines-cleared-count");

const nextCanvas = document.getElementById('next-piece');
const nextCtx = nextCanvas.getContext('2d');
const nextScale = 20;
let nextTetromino;

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
    tetromino.rotate(); // rotate()メソッドを呼び出す
}

function canMove(newX, newY, newShape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (newShape[row][col]) {
                // Outside the game board
                if (
                    newX + col < 0 ||
                    newX + col >= columns ||
                    newY + row >= rows ||
                    (newY + row < 0 && row !== 0) // 上の壁を無視するための条件を追加
                ) {
                    return false;
                }

                // Collides with an existing block
                if (gameBoard[newY + row] && gameBoard[newY + row][newX + col]) {
                    return false;
                }
            }
        }
    }
    return true;
}

const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0));

function clearLines() {
    let linesCleared = 0;

    outer: for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < columns; col++) {
            if (!gameBoard[row][col]) {
                continue outer;
            }
        }
        gameBoard.splice(row, 1);
        linesCleared++;
    }

    // 消去された行数だけ新しい空行を追加
    for (let i = 0; i < linesCleared; i++) {
        gameBoard.unshift(Array(columns).fill(0));
    }

    // 行数を更新
    linesClearedCount += linesCleared;
    linesClearedDisplay.textContent = linesClearedCount;

    // 速度を更新
    const baseSpeed = 1000;
    const speedDecreaseFactor = 150;
    const speed = baseSpeed - speedDecreaseFactor * Math.log(1 + linesClearedCount);

    // 速度表示を更新
    const fallingSpeedDisplay = document.getElementById("falling-speed-display");
    fallingSpeedDisplay.textContent = Math.round(speed);

    startInterval(speed);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    tetromino.draw();
    drawGhost(); // 追加
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

function drawGhost() {
    const ghostY = getGhostY();
    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col]) {
                new Block(tetromino.x + col, ghostY + row, tetromino.color, true).draw(); // isGhostをtrueに設定
            }
        }
    }
}

function getGhostY() {
    let ghostY = tetromino.y;
    while (canMove(tetromino.x, ghostY + 1, tetromino.shape)) {
        ghostY++;
    }
    return ghostY;
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
    update(); // この行を追加
}

function dropDown() {
    const ghostY = getGhostY();
    tetromino.y = ghostY;
    addToBoard();
    clearLines();
    if (tetromino.y < 0) {
        clearInterval(gameInterval);
        alert('Game Over!');
        return;
    }
    startGame();
    update();
}

function addToBoard() {
    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col]) {
                // Check if the row is within the game board's range
                if (tetromino.y + row >= 0) {
                    gameBoard[tetromino.y + row][tetromino.x + col] = tetromino.color;
                }
            }
        }
    }
}

function drawNextTetromino() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    for (let row = 0; row < nextTetromino.shape.length; row++) {
        for (let col = 0; col < nextTetromino.shape[row].length; col++) {
            if (nextTetromino.shape[row][col]) {
                nextCtx.fillStyle = nextTetromino.color;
                nextCtx.fillRect((col + 1) * nextScale, (row + 1) * nextScale, nextScale, nextScale);
                nextCtx.strokeStyle = '#000';
                nextCtx.strokeRect((col + 1) * nextScale, (row + 1) * nextScale, nextScale, nextScale);
            }
        }
    }
}

function canMoveWithOffset(newX, newY, newShape) {
    let offsetX = 0;

    while (true) {
        if (canMove(newX + offsetX, newY, newShape)) {
            return offsetX;
        } else if (canMove(newX - offsetX, newY, newShape)) {
            return -offsetX;
        }
        offsetX++;

        // If the offsetX becomes greater than the width of the shape, no valid movement is possible
        if (offsetX > newShape[0].length) {
            return null;
        }
    }
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
    } else if (event.code === "ArrowUp") {
        dropDown();
    }
});

function startGame() {
    if (!nextTetromino) {
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        nextTetromino = new Tetromino(0, 0, shapeIndex, colors[shapeIndex]); // shapeIndexを渡すように修正
    }

    tetromino = nextTetromino;
    tetromino.x = 4;
    tetromino.y = -1;

    const nextShapeIndex = Math.floor(Math.random() * shapes.length);
    nextTetromino = new Tetromino(0, 0, nextShapeIndex, colors[nextShapeIndex]); // nextShapeIndexを渡すように修正

    drawNextTetromino(); // 次のテトリミノを描画
}

function startInterval(speed) {
    clearInterval(gameInterval); // 既存のインターバルをクリア
    gameInterval = setInterval(() => {
        moveDown();
        update();
    }, speed);
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

startGame();
startInterval(1000);
gameLoop();
