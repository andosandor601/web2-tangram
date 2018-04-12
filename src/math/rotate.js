import { Point } from './Point.js';

export default function rotate(centrum, point, angle) {
    var distance = Math.sqrt((point.x - centrum.x) * (point.x - centrum.x) + (point.y - centrum.y) * (point.y - centrum.y));
    angle *= (Math.PI / 180);
    var rotateAngle = Math.atan2(point.y - centrum.y, point.x - centrum.x) + angle;

    var x = centrum.x + (distance * Math.cos(rotateAngle));
    var y = centrum.y + (distance * Math.sin(rotateAngle));

    return new Point(x, y);
}