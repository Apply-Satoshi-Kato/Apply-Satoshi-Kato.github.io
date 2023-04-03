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
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 0],
        [1],
    ],
    [
        [1, 1, 1, 0],
        [0, 0, 1],
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
    gameInterval = setInterval(moveDown, 1000 / 2);
}

function moveDown() {
    tetromino.y++;
    tetromino.draw();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tetromino.draw();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

startGame();
gameLoop();
