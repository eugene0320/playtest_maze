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

    // Define paths with clear angular gaps
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
        y: mazeCenterY - levels * levelHeight + 10,
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
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    function updateBallPosition() {
        if (ball.active) {
            ball.y += ball.velocityY; // Apply gravity

            if (isWithinAnyPath()) {
                if (ball.y >= mazeCenterY) {
                    ball.active = false;
                    ctx.fillText("Complete!", mazeCenterX, mazeCenterY + 20);
                }
            } else {
                ball.y -= ball.velocityY; // Reset position if not aligned with a path
            }
        }
    }

    function isWithinAnyPath() {
        const currentRadius = Math.sqrt(Math.pow(ball.x - mazeCenterX, 2) + Math.pow(ball.y - mazeCenterY, 2));
        const currentLevel = Math.floor((currentRadius - levelHeight) / levelHeight) + 1;
        const currentAngle = (Math.atan2(ball.y - mazeCenterY, ball.x - mazeCenterX) + 2 * Math.PI) % (2 * Math.PI);

        const path = paths.find(p => p.level === currentLevel);
        if (path) {
            const adjustedStartAngle = (path.startAngle + angle * Math.PI / 180) % (2 * Math.PI);
            const adjustedEndAngle = (path.endAngle + angle * Math.PI / 180) % (2 * Math.PI);
            return currentAngle >= adjustedStartAngle && currentAngle <= adjustedEndAngle;
        }
        return false;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            angle -= 5;
            drawMaze();
        } else if (e.key === 'ArrowRight') {
            angle += 5;
            drawMaze();
        } else if (e.code === 'Space' && !ball.active) {
            ball.active = true;
        }
    });

    function update() {
        drawMaze();
        updateBallPosition();
        drawBall();
        requestAnimationFrame(update);
    }

    update(); // Start the animation loop
});
