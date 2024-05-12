import { Rectangle } from "./Rectangle.js";
import { QuadTree } from "./QuadTree.js";

// Get reference to the canvas element
const canvas = document.getElementById('glCanvas');
const ctx = canvas.getContext('2d');

let circleCount = document.getElementById('spawnFreqSlider').value;

// Set the canvas size to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// QuadTree setup
const quadTreeCapacity = 10; // Maximum number of circles in a quadrant
const quadTreeBounds = new Rectangle(0, 0, canvas.width, canvas.height);
const quadTree = new QuadTree(quadTreeBounds, quadTreeCapacity);

// Array to store every rendered circle
let circles = [];

// @todo make this a slider in a menu to mess with thing on the fly
let circleRadius = Number(document.getElementById('radiusSlider').value);

let spamAnimation;

// Function to draw a circle
const drawCircle = (circle) => {
    ctx.beginPath();
    // make circles grow here if desired
    let circleRadiusChange = 0;
    ctx.arc(circle.x, circle.y, circle.radius += circleRadiusChange, 0, Math.PI * 2);
    ctx.fillStyle = circle.color; // You can change the color here
    ctx.fill();
};

let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

// Function to update circle positions and handle collisions
const update = () => {
    // Calculate time elapsed since last frame
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;

    frameCount++;
    // Calculate FPS once every x milliseconds
    if (deltaTime > 500) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        frameCount = 0;
        lastFrameTime = currentTime; // Update lastFrameTime only after FPS calculation
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clear the quad tree and insert circles
    quadTree.clear();
    for (const circle of circles) {
        quadTree.insert(circle);
    }

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

        // Get nearby circles from the quad tree
        const range = new Rectangle(circleA.x - circleRadius * 2, circleA.y - circleRadius * 2, circleRadius * 4, circleRadius * 4);
        const nearbyCircles = quadTree.query(range);

        // Check for collisions with nearby circles
        for (const circleB of nearbyCircles) {
            if (circleA !== circleB) {
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
    }

    // Remove circles marked for deletion
    circles = circles.filter(circle => !circle.markedForDeletion);

    // Display FPS
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${fps}`, 40, 20);

    // CPU and GPU engage, DO IT AGAIN!
    requestAnimationFrame(update);
};

const spawnNewCircles = (event = null, mouseX = null, mouseY = null, color = null) => {
    // starting to get dirty here... should clean this up. @todo Don't force this function to make decisions it doesn't need to
    if (event) {
        // Get the mouse coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }

    // Create X new circle objects
    for (let i = 0; i < circleCount; i++) {
        const circle = {
            x: mouseX,
            y: mouseY,
            dx: 0, // X direction (horizontal) of the drift
            dy: 0, // Y direction (vertical) of the drift
            color: color ?? generateRandomColor(),
            radius: circleRadius
        };

        // Set a random direction
        const angle = Math.random() * Math.PI * 2;
        circle.dx = Math.cos(angle) * 2; // Adjust speed as needed
        circle.dy = Math.sin(angle) * 2; // Adjust speed as needed

        // Add the circle to the array
        circles.push(circle);
    }
};

let positionsToSpam = [];
const startFixedCircleSpam = () => {
    positionsToSpam.forEach((coords) => spawnNewCircles(null, coords[0], coords[1], coords[2]))
    spamAnimation = requestAnimationFrame(startFixedCircleSpam);
}

const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct the color string in hexadecimal format
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Event listener for mousedown event
document.addEventListener('mousedown', (event) => {
    // if left click
    if (event.button === 0) {
        positionsToSpam.push([event.clientX, event.clientY, generateRandomColor()]);
        if (!spamAnimation) requestAnimationFrame(startFixedCircleSpam);
    }

    // middle click removes a point, the oldest existing one.
    if (event.button === 1) {
        positionsToSpam.shift();
    }
});

// menu event handlers
const menu = {
    menuOpen: false,

    updateMenuOnValChange: (target, value) => {
        document.getElementById(target).innerText = value;
    },

    initMenuVals: () => {
        menu.updateMenuOnValChange('circleRadiusValDisplay', circleRadius);
        menu.updateMenuOnValChange('spawnFreqValDisplay', circleCount);
    },

    initEventHandlers: () => {
        document.querySelectorAll('.menu, .submenu').forEach(menu => {
            menu.addEventListener('mousedown', (event) => {
                event.stopPropagation();
            });
        });

        document.getElementById('radiusSlider').addEventListener('input', (event) => {
            circleRadius = Number(event.target.value);
            menu.updateMenuOnValChange('circleRadiusValDisplay', circleRadius);
        })

        document.getElementById('spawnFreqSlider').addEventListener('input', (event) => {
            circleCount = Number(event.target.value);
            menu.updateMenuOnValChange('spawnFreqValDisplay', circleCount);
        })

        document.getElementById('toggleMenuBtn').addEventListener('mousedown', () => {
            event.stopPropagation();
            menu.toggleMenu();
        });
    },

    toggleMenu: () => {
        if (menu.menuOpen) {
            // close it
            document.getElementById('menu').classList.remove('show-menu');
            menu.menuOpen = false;
        } else {
            document.getElementById('menu').classList.add('show-menu');
            menu.menuOpen = true;
        }
    }
}

menu.initEventHandlers()
menu.initMenuVals();

// Call update function to start the animation
update();