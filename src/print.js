import {FreeGame} from "./levels/FreeGame.js";
import {Rabbit} from "./levels/Rabbit.js";

export default function printMe(canvas) {
    var context = canvas.getContext("2d");

    context.beginPath();
    context.fillStyle = "blue";
    context.font = "small-caps bold 32px Arial";
    context.fillText("Tangram", (canvas.width / 2) - 17, (canvas.height / 2) - 50);
    context.fillText("Játékért kattints", (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    context.fill();

    canvas.addEventListener('click', function newGame(evt) {
        canvas.removeEventListener('click', newGame);
        new Rabbit(canvas);
    });
}