<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Physics Engine with WebGL</title>
    <link rel="stylesheet" href="./css/app.css?ver=<?php echo rand(0,1000); ?>">
</head>
    <body>
        <div class="menu">
            <label for="radiusSlider">Circle Radius:</label>
            <input type="range" id="radiusSlider" name="radiusSlider" min="1" max="30" value="8">
            <label for="spawnFreqSlider">Spawn Frequency:</label>
            <input type="range" id="spawnFreqSlider" name="spawnFreqSlider" min="0" max="30" value="1">
        </div>
        <canvas id="glCanvas" width="600" height="400"></canvas>
        <script type="module" src="./js/main.js?ver=<?php echo rand(0,1000); ?>"></script>
    </body>
</html>