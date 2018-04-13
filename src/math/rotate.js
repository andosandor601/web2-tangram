import { Point } from './Point.js';
import distance from './distance.js';

export default function rotate(centrum, point, angle) {
    var dist = distance(centrum, point);
    angle *= (Math.PI / 180);
    var rotateAngle = Math.atan2(point.y - centrum.y, point.x - centrum.x) + angle;

    var x = centrum.x + (dist * Math.cos(rotateAngle));
    var y = centrum.y + (dist * Math.sin(rotateAngle));

    return new Point(x, y);
}