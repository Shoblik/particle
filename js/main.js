// Get reference to the canvas element
const canvas = document.getElementById('glCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store every rendered circle
let circles = [];

// @todo make this a slider in a menu to mess with thing on the fly
const circleRadius = 10;

let spamAnimation;
let mouseX = null;
let mouseY = null;

// Function to draw a circle
const drawCircle = (circle) => {
    ctx.beginPath();
    // make circles grow here if desired
    let circleRadiusChange = 0;
    ctx.arc(circle.x, circle.y, circle.radius += circleRadiusChange, 0, Math.PI * 2);
    ctx.fillStyle = circle.color; // You can change the color here
    ctx.fill();
};

// Function to update circle positions and handle collisions
const update = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through all circles
    for (let i = 0; i < circles.length; i++) {
        const circleA = circles[i];
        drawCircle(circleA);

        // Update circle position based on its direction
        circleA.x += circleA.dx;
        circleA.y += circleA.dy;

        // Check if circle is out of bounds and mark it for deletion
        if (circleA.x < -circleRadius || circleA.x > canvas.width + circleRadius || circleA.y < -circleRadius || circleA.y > canvas.height + circleRadius) {
            circleA.markedForDeletion = true;
        }

        // Check for collisions with other circles @todo There's probably better math that is faster...
        for (let j = i + 1; j < circles.length; j++) {
            const circleB = circles[j];
            const dx = circleB.x - circleA.x;
            const dy = circleB.y - circleA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circleRadius * 2) {
                // Circles collide, adjust velocities
                const angle = Math.atan2(dy, dx);
                const sine = Math.sin(angle);
                const cosine = Math.cos(angle);

                // Rotate circleA's velocity
                const vx0 = circleA.dx * cosine + circleA.dy * sine;
                const vy0 = circleA.dy * cosine - circleA.dx * sine;

                // Rotate circleB's velocity
                const vx1 = circleB.dx * cosine + circleB.dy * sine;
                const vy1 = circleB.dy * cosine - circleB.dx * sine;

                // New velocities after collision
                const vxTotal = vx0 - vx1;
                circleA.dx = ((circleA.radius - circleB.radius) * vx0 + 2 * circleB.radius * vx1) / (circleA.radius + circleB.radius);
                circleB.dx = vxTotal + circleA.dx;

                // Rotate velocities back
                circleA.dy = vy0 * cosine + vx0 * sine;
                circleA.dx = vx0 * cosine - vy0 * sine;
                circleB.dy = vy1 * cosine + vx1 * sine;
                circleB.dx = vx1 * cosine - vy1 * sine;

                // Update positions to avoid overlapping
                const overlap = circleRadius * 2 - distance + 1;
                circleA.x -= overlap * Math.cos(angle);
                circleA.y -= overlap * Math.sin(angle);
                circleB.x += overlap * Math.cos(angle);
                circleB.y += overlap * Math.sin(angle);
            }
        }
    }

    // Remove circles marked for deletion
    circles = circles.filter(circle => !circle.markedForDeletion);

    // CPU and GPU engage, DO IT AGAIN!
    requestAnimationFrame(update);
};

const spawnNewCircles = (event, mouseX=null, mouseY=null) => {
    // starting to get dirty here... should clean this up. @todo Don't force this function to make decisions it doesn't need to
    if (event) {
        // Get the mouse coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }

    // Create X new circle objects
    const circleCount = 5;
    for (let i = 0; i < circleCount; i++) {
        const circle = {
            x: mouseX,
            y: mouseY,
            dx: 0, // X direction (horizontal) of the drift
            dy: 0, // Y direction (vertical) of the drift
            color: generateRandomColor(),
            radius: circleRadius
        };

        // Set a random direction
        const angle = 1;
        circle.dx = Math.cos(angle) * 2; // Adjust speed as needed
        circle.dy = Math.sin(angle) * 2; // Adjust speed as needed

        // Add the circle to the array
        circles.push(circle);
    }
};

const spamConsole = () => {
    spawnNewCircles(null, mouseX, mouseY);
    spamAnimation = requestAnimationFrame(spamConsole);
}

const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return 'hotpink';

    // Construct the color string in hexadecimal format
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

};

// DOM Events
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    spawnNewCircles(event);
});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Event listener for mousedown event
document.addEventListener('mousedown', () => {
    // Start spamming the console with 'test'
    spamAnimation = requestAnimationFrame(spamConsole);
});

// Event listener for mouseup event
document.addEventListener('mouseup', () => {
    // Stop spamming the console when mouse button is released
    cancelAnimationFrame(spamAnimation);
});

// Call update function to start the animation
update();