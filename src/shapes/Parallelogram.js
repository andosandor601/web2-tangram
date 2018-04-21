import { Shape } from './Shape.js';
import { Point } from '../math/Point.js';
import checkPointInTriangle from '../math/pointAndTriangle.js';
import rotate from '../math/rotate.js';
import distance from '../math/distance.js';

export class Parallelogram extends Shape {
    constructor(shape, z, scale, color) {
        super(shape, z, scale, color);
    }

    initPoints(indexes) {
        super.initPoints(indexes);
        this.centre = new Point((this.points[0].x + this.points[2].x) / 2, (this.points[0].y + this.points[2].y) / 2);
    }

    isMouseInside(pointerX, pointerY) {
        return checkPointInTriangle(new Point(pointerX, pointerY), this.points[0], this.points[1], this.points[2], this.x, this.y) ||
            checkPointInTriangle(new Point(pointerX, pointerY), this.points[2], this.points[3], this.points[0], this.x, this.y);
    }
}