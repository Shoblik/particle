// Get reference to the canvas element
const canvas = document.getElementById('glCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store circles
let circles = [];
const circleRadius = 10;

// Function to draw a circle
const drawCircle = (x, y, color) => {
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = color; // You can change the color here
    ctx.fill();
};

// Function to update circle positions
const update = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through all circles
    circles.forEach(circle => {
        // Draw the circle
        drawCircle(circle.x, circle.y, circle.color);

        // Update circle position based on its direction
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Check if circle is out of bounds and mark it for deletion
        if (circle.x < -circleRadius || circle.x > canvas.width + circleRadius || circle.y < -circleRadius || circle.y > canvas.height + circleRadius) {
            circle.markedForDeletion = true;
        }
    });

    // Remove circles marked for deletion
    circles = circles.filter(circle => !circle.markedForDeletion);

    // Request the next animation frame
    requestAnimationFrame(update);
};

// Event listener for mousemove events
canvas.addEventListener('mousemove', (event) => spawnNewCircles(event));

const spawnNewCircles = (event) => {
    // Get the mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Create 10 new circle objects
    const circleCount = 5;
    for (let i = 0; i < circleCount; i++) {
        const circle = {
            x: mouseX,
            y: mouseY,
            dx: 0, // X direction (horizontal) of the drift
            dy: 0, // Y direction (vertical) of the drift
            color: generateRandomColor(),
        };

        // Set a random direction after a short delay
        const angle = Math.random() * Math.PI * 2;
        circle.dx = Math.cos(angle) * 2; // Adjust speed as needed
        circle.dy = Math.sin(angle) * 2; // Adjust speed as needed

        // Add the circle to the array
        circles.push(circle);
    }
};

let spamAnimation;

// Function to spam console with 'test'
const spamConsole = () => {
    spamAnimation = requestAnimationFrame(spamConsole);
};

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

const generateRandomColor = () => {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const green = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const blue = Math.floor(Math.random() * 256); // Random integer between 0 and 255

    // Construct the color string in hexadecimal format
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

// Call update function to start the animation
update();
