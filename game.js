document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';

    const mazeCenterX = canvas.width / 2;
    const mazeCenterY = canvas.height / 2;
    const levels = 6;
    const levelHeight = 50;
    let angle = 0; // Maze rotation angle in degrees
    let animationId = null; // To store requestAnimationFrame ID
    let gameOver = false; // Flag to check game over status

    const paths = [
        { level: 1, startAngle: 0, endAngle: Math.PI / 6 },
        { level: 2, startAngle: Math.PI / 3, endAngle: Math.PI / 2 },
        { level: 3, startAngle: 2 * Math.PI / 3, endAngle: 5 * Math.PI / 4 },
        { level: 4, startAngle: 4 * Math.PI / 3, endAngle: 3 * Math.PI / 2 },
        { level: 5, startAngle: 11 * Math.PI / 6, endAngle: 2 * Math.PI },
        { level: 6, startAngle: Math.PI / 6, endAngle: Math.PI / 3 }
    ];

    const ball = {
        x: mazeCenterX,
        y: mazeCenterY - (levels * levelHeight) + levelHeight / 2, // Center the ball within the outermost path
        radius: 5,
        velocityY: 1,
        active: false
    };

    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(mazeCenterX, mazeCenterY);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-mazeCenterX, -mazeCenterY);

        for (let i = 1; i <= levels; i++) {
            ctx.beginPath();
            ctx.arc(mazeCenterX, mazeCenterY, i * levelHeight, 0, 2 * Math.PI);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            const path = paths.find(p => p.level === i);
            if (path) {
                ctx.beginPath();
                ctx.arc(mazeCenterX, mazeCenterY, i * levelHeight, path.startAngle, path.endAngle);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'white';
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    function updateBallPosition() {
        if (ball.active) {
            const potentialY = ball.y + ball.velocityY;
            const isPathValid = isWithinAnyPath(ball.x, potentialY);

            if (isPathValid) {
                ball.y = potentialY;

                // Check if ball reaches the center
                if (Math.sqrt((ball.x - mazeCenterX) ** 2 + (ball.y - mazeCenterY) ** 2) <= levelHeight / 2 + ball.radius) {
                    ball.active = false;
                    gameOver = true;
                    displayVictoryScreen();
                }
            }
        }
    }

    function isWithinAnyPath(x, y) {
        const currentRadius = Math.sqrt(Math.pow(x - mazeCenterX, 2) + Math.pow(y - mazeCenterY, 2));
        const currentLevel = Math.floor((currentRadius - levelHeight / 2) / levelHeight) + 1;
        const currentAngle = (Math.atan2(y - mazeCenterY, x - mazeCenterX) + 2 * Math.PI) % (2 * Math.PI);

        for (let path of paths) {
            if (currentLevel === path.level) {
                const adjustedStartAngle = (path.startAngle + angle * Math.PI / 180) % (2 * Math.PI);
                const adjustedEndAngle = (path.endAngle + angle * Math.PI / 180) % (2 * Math.PI);
                if (currentAngle >= adjustedStartAngle && currentAngle <= adjustedEndAngle) {
                    return true;
                }
            }
        }
        return false;
    }

    function displayVictoryScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'yellow';
        ctx.font = '48px Arial';
        ctx.fillText("Victory!", mazeCenterX, mazeCenterY);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            angle -= 5;
        } else if (e.key === 'ArrowRight') {
            angle += 5;
        } else if (e.code === 'Space' && !ball.active) {
            ball.active = true;
        }
    });

    function update() {
        if (!gameOver) {
            drawMaze();
            updateBallPosition();
            drawBall();
            animationId = requestAnimationFrame(update);
        }
    }

    update(); // Start the animation loop
});
