import { FreeGame } from "./levels/FreeGame.js";
import { Hard } from "./levels/Hard.js";
import { Medium } from "./levels/Medium.js";
import { Easy } from "./levels/Easy.js";
import freeImg from "./img/free.png";
import rabbitImg from "./img/rabbit.png";

export default function printMe(canvas) {
    var context = canvas.getContext("2d");

    drawMaps(context);

    context.beginPath();
    context.fillStyle = "blue";
    context.font = "small-caps bold 32px Arial";
    context.fillText("Tangram", (canvas.width / 2) - 17, (canvas.height / 2) - 50);
    context.fillText("Játékért kattints", (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    context.fill();

    canvas.addEventListener('click', function newGame(evt) {
        canvas.removeEventListener('click', newGame);
        new Hard(canvas);
    });
}

function drawMaps(context) {
    var imgs = [];
    imgs.push(freeImg, rabbitImg);

    for (let i = 0; i < imgs.length; i++) {
        var img = new Image(101, 155);
        img.onload = function () {
            context.drawImage(this, i * 101, 0);
        };

        img.src = imgs[i];
    }
}