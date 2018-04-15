import { FreeGame } from "./levels/FreeGame.js";
import { Hard } from "./levels/Hard.js";
import { Medium } from "./levels/Medium.js";
import { Easy } from "./levels/Easy.js";
import { Square } from "./shapes/Square.js";
import {exit, isExit} from "./exit.js";

export default function printMe(canvas) {
    var imgShapes = [];

    drawMaps(imgShapes, canvas);

    // context.beginPath();
    // context.fillStyle = "blue";
    // context.font = "small-caps bold 32px Arial";
    // context.fillText("Tangram", (canvas.width / 2) - 17, (canvas.height / 2) - 50);
    // context.fillText("Játékért kattints", (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    // context.fill();

    canvas.addEventListener('click', function chooseLevel(evt) {
        
        for (let i = 0; i < imgShapes.length; i++) {
            if (imgShapes[i].isMouseInside(evt.clientX, evt.clientY)) {
                if (imgShapes[i].name === "FreeGame") {
                    new FreeGame(canvas);
                    canvas.removeEventListener('click', chooseLevel);
                }
                else {
                    drawDifficulties(canvas, imgShapes[i].name);
                    canvas.removeEventListener('click', chooseLevel);
                }
            }
        }
    });
}

function drawMaps(container, canvas) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    var imgData = require('./data/levelImages.json');
    for (let i = 0; i < imgData.levels.length; i++) {
        var imagePath = imgData.levels[i].source;
        var imgX = imgData.levels[i].dimension[0];
        var imgY = imgData.levels[i].dimension[1];
        var img = new Image(imgX, imgY);

        img.onload = function () {
            var xPos = ((i) * imgX) % canvas.width;
            var yPos = Math.floor((i * imgX) / canvas.width) * imgY;
            context.drawImage(this, xPos, yPos);
            var shape = new Square(
                {
                    "indexes": [
                        [xPos, yPos],
                        [xPos, yPos + imgY],
                        [xPos + imgX, yPos + imgY],
                        [xPos + imgX, yPos]
                    ]
                },
                1, 1, "red"
            );
            shape.name = imgData.levels[i].name;
            container.push(shape);
        };

        img.src = imagePath;
    }
}

function drawDifficulties(canvas, level) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    exit(canvas);
    var imgData = require('./data/difficultyImages.json');
    var difficulties = [];

    for (let i = 0; i < imgData.difficulties.length; i++) {
        var imagePath = imgData.difficulties[i].source;
        var imgX = imgData.difficulties[i].dimension[0];
        var imgY = imgData.difficulties[i].dimension[1];
        var img = new Image(imgX, imgY);

        img.onload = function () {
            var xPos = ((i) * (imgX + 10)) % canvas.width;
            var yPos = Math.floor((i * (imgX + 10)) / canvas.width) * imgY;
            context.drawImage(this, xPos, yPos);
            var shape = new Square(
                {
                    "indexes": [
                        [xPos, yPos],
                        [xPos, yPos + imgY],
                        [xPos + imgX, yPos + imgY],
                        [xPos + imgX, yPos]
                    ]
                },
                1, 1, "red"
            );
            shape.name = imgData.difficulties[i].name;
            difficulties.push(shape);
        };

        img.src = imagePath;
    }
    canvas.addEventListener('click', function chooseDifficulty(evt) {
        canvas.removeEventListener('click', chooseDifficulty);
        if (isExit(canvas.width, evt.clientX, evt.clientY)) {
            printMe(canvas);
        }
        else{
            for (let i = 0; i < difficulties.length; i++) {
                if (difficulties[i].isMouseInside(evt.clientX, evt.clientY)) {
                    if (difficulties[i].name === "easy") {
                        new Easy(canvas);
                    }
                    else if (difficulties[i].name === "medium") {
                        new Medium(canvas);
                    }
                    else {
                        new Hard(canvas);
                    }
                }
            }
        }
    });
}