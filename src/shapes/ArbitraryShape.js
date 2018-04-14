import { Shape } from './Shape.js';
import { Point } from '../math/Point.js';
import checkPointInTriangle from '../math/pointAndTriangle.js';
import rotate from '../math/rotate.js';
import distance from '../math/distance.js';

export class ArbitraryShape extends Shape {
    constructor(indexes, scale) {
        super();
        this.scale = scale;

        this.points = [];

        this.x = 0;
        this.y = 0;

        this.initPoints(indexes);

        this.isDragging = false;
    }

    initPoints(indexes) {
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
        context.lineWidth = 1;
        context.strokeStyle = '#666666';
        context.stroke();
    }
}