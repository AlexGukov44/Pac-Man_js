const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

function resizeCanvas() {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    resetPlayerAndDots();
}

window.addEventListener('load', resizeCanvas); 
window.addEventListener('resize', resizeCanvas);



const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 3,
    color: '#dfc252',
    dx: 0,
    dy: 0,
};

function drawPlayer(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

const dots = [];
let dotCount = 30;
let dotRadius = 10;
let dotColor = 'red';   //  #10375c
let score = 0;

function drawDots() {
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        drawPlayer(dot.x, dot.y, dot.radius, dot.color);
    }
}

function createDots() {
    for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        dots.push({
            x,
            y,
            radius: dotRadius,
            color: dotColor,
        });
    }
}
createDots();

function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x - player.radius < 0)
        player.x = player.radius;

    if (player.x + player.radius > canvas.width)
        player.x = canvas.width - player.radius;

    if (player.y - player.radius < 0)
        player.y = player.radius;

    if (player.y + player.radius > canvas.height)
        player.y = canvas.height - player.radius;
}

function checkCollision() {
    //for (let i = dots.length - 1; i >= 0; i--) {
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const distance = Math.sqrt(Math.pow(player.x - dot.x, 2) + Math.pow(player.y - dot.y, 2));

        if (distance < player.radius + dot.radius) {
            dots.splice(i, 1);
            score ++;
            scoreDisplay.textContent = `очки: ${score}`;
            break;
        }
    }
}

let startTime;
let timeLeft = 60; 
let timerInterval; 

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timeLeft = Math.max(0, 60 - Math.floor((Date.now() - startTime) / 1000));
        timerDisplay.textContent = `таймер: ${(timeLeft)}`;
    }, 1000);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player.x, player.y, player.radius, player.color);
    drawDots();
    updatePlayer();
    checkCollision();

    if (dots.length === 0) {
        clearInterval(timerInterval);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Tahoma';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ПОЗДРАВЛЯЮ! ', canvas.height / 2, canvas.width / 2); 
        return;
    }
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Tahoma';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Время вышло!', canvas.height / 2, canvas.width / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
            player.dx = player.speed;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            player.dy = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            player.dx = 0;
            break;
    }
});

function resetPlayerAndDots() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    dots.length = 0;
    createDots();
    score = 0;
    scoreDisplay.textContent = `очки: ${score}`;
    timeLeft = 30;
    clearInterval(timerInterval); 
    startTimer(); 
}

startTimer();
gameLoop();
