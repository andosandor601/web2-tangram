import rotate from '../math/rotate.js';
import { Point } from '../math/Point.js';
import distance from '../math/distance.js';

export class Shape{

    constructor(shape, z, scale, color){
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