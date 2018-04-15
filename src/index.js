import _ from 'lodash';
import printMe from './print.js';

function component() {
    var element = document.createElement('div');
    var canvas = document.createElement('canvas');

    const borderWidth = 2;
    const width = Math.min(window.innerWidth, window.innerHeight) - 5 * borderWidth;
    canvas.width = canvas.height = width;
    canvas.style.touchAction = "none";
    printMe(canvas);

    element.appendChild(document.createElement('div')).appendChild(canvas);

    return element;
}

document.body.appendChild(component());