import door from './img/door.png';

export function exit(canvas) {
    drawImage(canvas);
}

function drawImage(canvas) {
    var context = canvas.getContext("2d");

    var img = new Image(100, 100);
    img.onload = function () {
        context.drawImage(this, canvas.width - 100 , canvas.width - 100);
    };
    img.src = door;
}

export function isExit(width, pointerX, pointerY){
    if ((pointerX >= width - 100) && (pointerY >= width -100)) {
        return true;
    }else{
        return false;
    }
}