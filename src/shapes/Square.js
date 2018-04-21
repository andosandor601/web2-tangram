import { Point } from '../math/Point.js';
import checkPointInTriangle from '../math/pointAndTriangle.js';
import rotate from '../math/rotate.js';
import distance from '../math/distance.js';
import { Parallelogram } from './Parallelogram.js';

export class Square extends Parallelogram {
    constructor(shape, z, scale, color) {
        super(shape, z, scale, color);
    }

    isMouseInside(pointerX, pointerY) {
        return checkPointInTriangle(new Point(pointerX, pointerY), this.points[0], this.points[1], this.points[2], this.x, this.y) ||
            checkPointInTriangle(new Point(pointerX, pointerY), this.points[2], this.points[3], this.points[0], this.x, this.y);
    }
}