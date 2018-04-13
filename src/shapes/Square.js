import { Shape } from './Shape.js';
import { Point } from '../math/Point.js';
import check from '../math/pointAndTriangle.js';
import rotate from '../math/rotate.js';

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

        this.map = false;

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
        if (this.map) {
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
        return check(new Point(pointerX, pointerY), this.points[0], this.points[1], this.points[2], this.x, this.y) ||
            check(new Point(pointerX, pointerY), this.points[2], this.points[3], this.points[0], this.x, this.y);
    }

    rotate() {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i] = rotate(this.centre, this.points[i], this.angle);
        }
    }
}