import { Shape } from './Shape.js';
import { Point } from '../math/Point.js';
import checkPointInTriangle from '../math/pointAndTriangle.js';
import rotate from '../math/rotate.js';
import distance from '../math/distance.js';

export class Square extends Shape {
    constructor(shape, z, scale, color) {
        super();
        this.z = z;

        this.color = color;
        this.scale = scale;

        this.centre;

        this.angle = 45;

        this.points = [];

        this.x = 0;
        this.y = 0;

        this.empty = false;

        this.initPoints(shape.indexes);

        this.isDragging = false;
    }

    initPoints(indexes) {
        this.indexes = indexes;
        for (let i = 0; i < indexes.length; i++) {
            this.points.push(new Point(indexes[i][0] * this.scale, indexes[i][1] * this.scale));
        }
        this.centre = new Point((this.points[0].x + this.points[2].x) / 2, (this.points[0].y + this.points[2].y) / 2);
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.points[0].x + this.x, this.points[0].y + this.y);
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x + this.x, this.points[i].y + this.y);
        }
        context.closePath();
        if (this.empty) {
            context.lineWidth = 1;
            context.strokeStyle = '#666666';
            context.stroke();
        }
        else {
            context.fillStyle = this.color;
            context.fill();
        }
    }

    isMouseInside(pointerX, pointerY) {
        return checkPointInTriangle(new Point(pointerX, pointerY), this.points[0], this.points[1], this.points[2], this.x, this.y) ||
            checkPointInTriangle(new Point(pointerX, pointerY), this.points[2], this.points[3], this.points[0], this.x, this.y);
    }

    rotate() {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i] = rotate(this.centre, this.points[i], this.angle);
        }
    }

    isCloseToPoint(pointerX, pointerY, radius) {
        for (let i = 0; i < this.points.length; i++) {
            if (distance(new Point(pointerX, pointerY), new Point(this.points[i].x + this.x, this.points[i].y + this.y)) < radius) {
                return true;
            }
        }
        return false;
    }

    findFit(map) {
        for (let i = 0; i < map.length; i++) {
            if (map[i].name === this.name && this.isNear(map[i])) {
                return map[i];
            }       
        }
        return null;
    }

    isNear(shape) {
        for (let i = 0; i < shape.points.length; i++) {
            if (!this.isCloseToPoint(shape.points[i].x + shape.x, shape.points[i].y + shape.y, (0.3 * this.scale))) {
                return false;
            }
        }
        return true;
    }

    accept(shape) {
        this.empty = false;
    }
}