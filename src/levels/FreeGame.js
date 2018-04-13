import { Triangle } from '../shapes/Triangle.js';
import { Square } from '../shapes/Square.js';
import { Parallelogram } from '../shapes/Parallelogram.js';

export class FreeGame {

    constructor(canvas) {

        this.canvas = canvas;

        this.context = canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.BCR = canvas.getBoundingClientRect();
        this.offsetX = this.BCR.left;
        this.offsetY = this.BCR.top;

        this.dragok = false;
        this.wasMove = false;
        this.startX;
        this.startY;

        this.scale = this.width / 20;

        this.mainShapes = [];
        this.createdShapes = [];

        this.clear();
        this.initMainShapes();

        this.canvas.addEventListener("pointerdown", e => this.onDown(e));
        this.canvas.addEventListener("pointermove", e => this.onMove(e));
        this.canvas.addEventListener("pointerup", e => this.onUp(e));

        this.draw();

        //rotate an object (last answer):
        //https://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates
    }


    initMainShapes() {
        if (!(this.mainShapes.length > 0)) {
            const shapeData = require('../data/shapes.json');
            //var shapeData = JSON.parse('./data/shapes.json');
            var elements = shapeData.shapes;
            for (let i = 0; i < elements.length; i++) {
                this.createShape(elements[i]);
            }
            this.setMainShapesPositions();
        }
    }

    createShape(shape) {
        if (shape.type === 'triangle') {
            var triangle = new Triangle(shape, 0, this.scale, shape.color);
            triangle.name = shape.name;
            this.mainShapes.push(triangle);
        } else if (shape.type === 'square') {
            var square = new Square(shape, 0, this.scale, shape.color);
            square.name = shape.name;
            this.mainShapes.push(square);
        } else {
            var parallelogram = new Parallelogram(shape, 0, this.scale, shape.color);
            parallelogram.name = shape.name;
            this.mainShapes.push(parallelogram);
        }
    }

    setMainShapesPositions() {
        for (let i = 0; i < this.mainShapes.length; i++) {
            this.mainShapes[i].x = i * 2 * this.scale;
        }
    }

    addShape(shape) {
        if (shape instanceof Triangle) {
            var triangle = new Triangle(shape, 1, this.scale, shape.color);
            triangle.name = shape.name;
            this.createdShapes.push(triangle);
            return triangle;
        } else if (shape instanceof Square) {
            var square = new Square(shape, 1, this.scale, shape.color);
            square.name = shape.name;
            this.createdShapes.push(square);
            return square;
        } else {
            var parallelogram = new Parallelogram(shape, 1, this.scale, shape.color);
            parallelogram.name = shape.name;
            this.createdShapes.push(parallelogram);
            return parallelogram;
        }
    }

    draw() {
        this.clear();
        this.mainShapes.forEach(shape => {
            shape.draw(this.context);
        });
        this.createdShapes.forEach(shape => {
            shape.draw(this.context);
        });
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    onDown(e) {
        e.preventDefault();
        e.stopPropagation();

        var pointerX = parseInt(e.clientX - this.offsetX);
        var pointerY = parseInt(e.clientY - this.offsetY);

        this.dragok = false;
        this.mainShapes.forEach(shape => {
            if (shape.isMouseInside(pointerX, pointerY)) {
                this.dragok = true;
                var newShape = this.addShape(shape);
                newShape.x = parseInt(e.clientX);
                newShape.y = parseInt(shape.y + this.scale * 3);
                this.draw();
            }
        });

        this.createdShapes.forEach(shape => {
            if (shape.isMouseInside(pointerX, pointerY)) {
                this.dragok = true;
                shape.isDragging = true;
            }
        });

        this.startX = pointerX;
        this.startY = pointerY;
    }

    onMove(e) {
        if (this.dragok) {
            this.wasMove = true;
            e.preventDefault();
            e.stopPropagation();

            var pointerX = parseInt(e.clientX - this.offsetX);
            var pointerY = parseInt(e.clientY - this.offsetY);

            var distanceX = pointerX - this.startX;
            var distanceY = pointerY - this.startY;

            this.createdShapes.forEach(shape => {
                if (shape.isDragging) {
                    shape.x += distanceX;
                    shape.y += distanceY;
                }
            });

            this.draw();

            this.startX = pointerX;
            this.startY = pointerY;
        }
    }

    onUp(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.wasMove) {
            this.createdShapes.forEach(shape => {
                if (shape.isDragging) {
                    shape.rotate();
                }
            });
            this.draw();
        }

        this.dragok = false;
        this.wasMove = false;
        this.createdShapes.forEach(shape => {
            shape.isDragging = false;
        });
    }
}