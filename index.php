<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Physics Engine with WebGL</title>
    <link rel="stylesheet" href="./css/app.css?ver=<?php echo rand(0,1000); ?>">
</head>
    <body>
        <button id="toggleMenuBtn" class="toggle-menu">
            <div class="hamburger"></div>
            <div class="hamburger"></div>
            <div class="hamburger"></div>
        </button>
        <div class="menu" id="menu">
            <div class="standard-menu-item">
                <p>Version 1.02</p>
            </div>
            <div class="standard-menu-item">
                <ul>
                    <li>Left click or touch creates a new spawn point</li>
                    <li>Middle click removes the oldest spawn point</li>
                </ul>
            </div>
            <div class="standard-menu-item">
                <label for="radiusSlider">Circle Radius = <span id="circleRadiusValDisplay"></span>px</label>
                <input type="range" id="radiusSlider" name="radiusSlider" min="1" max="30" value="8">
            </div>
            <div class="standard-menu-item">
                <label for="spawnFreqSlider">Spawn Frequency = <span id="spawnFreqValDisplay"></span> per frame</label>
                <input type="range" id="spawnFreqSlider" name="spawnFreqSlider" min="0" max="30" value="1">
            </div>
        </div>
        <canvas id="glCanvas" width="600" height="400"></canvas>
        <script type="module" src="./js/main.js?ver=<?php echo rand(0,1000); ?>"></script>
    </body>
</html>