import { Point } from './Point.js';
import distance from './distance.js';

export default function rotate(centrum, point, angle) {
    var dist = distance(centrum, point);
    angle *= (Math.PI / 180);
    var rotateAngle = parseFloat((Math.atan2(point.y - centrum.y, point.x - centrum.x) + angle).toPrecision(12));

    var x = parseFloat((centrum.x + (dist * Math.cos(rotateAngle))).toPrecision(12));
    var y = parseFloat((centrum.y + (dist * Math.sin(rotateAngle))).toPrecision(12));

    return new Point(x, y);
}