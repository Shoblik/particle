// Get reference to the canvas element
const canvas = document.getElementById('glCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store circles
let circles = [];
const circleRadius = 10;

let spamAnimation;
let mouseX = null;
let mouseY = null;

// Function to draw a circle
const drawCircle = (circle) => {
    ctx.beginPath();
    // make circles grow
    let circleRadiusChange = 0;
    ctx.arc(circle.x, circle.y, circle.radius += circleRadiusChange, 0, Math.PI * 2);
    ctx.fillStyle = circle.color; // You can change the color here
    ctx.fill();
};

// Function to update circle positions
const update = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through all circles
    circles.forEach(circle => {
        // Draw the circle
        drawCircle(circle);

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

// Function to handle touch and mouse events
const handleInput = (x, y) => {
    // Create X new circle objects
    const circleCount = 4;
    for (let i = 0; i < circleCount; i++) {
        const circle = {
            x: x,
            y: y,
            dx: 0, // X direction (horizontal) of the drift
            dy: 0, // Y direction (vertical) of the drift
            color: generateRandomColor(),
            radius: circleRadius
        };

        // Set a random direction after a short delay
        const angle = Math.random() * Math.PI * 2;
        circle.dx = Math.cos(angle) * 2; // Adjust speed as needed
        circle.dy = Math.sin(angle) * 2; // Adjust speed as needed

        // Add the circle to the array
        circles.push(circle);
    }
};

// Function to generate random color
const generateRandomColor = () => {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const green = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const blue = Math.floor(Math.random() * 256); // Random integer between 0 and 255

    // Construct the color string in hexadecimal format
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

// Event listener for mousemove events
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    handleInput(mouseX, mouseY);
});

// Function to handle touch events
const handleTouch = (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    handleInput(x, y);
};

// Event listener for touchstart event
canvas.addEventListener('touchstart', handleTouch);

// Event listener for touchmove event
canvas.addEventListener('touchmove', handleTouch);

// Disable right-click context menu on the canvas
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Call update function to start the animation
update();