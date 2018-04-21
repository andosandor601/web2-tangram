import { Triangle } from '../shapes/Triangle.js';
import { Square } from '../shapes/Square.js';
import { Parallelogram } from '../shapes/Parallelogram.js';
import { exit, isExit } from "../exit.js";
import printMe from "../print.js";

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

        this.scale = parseFloat((this.width / 13).toPrecision(12));

        this.mainShapes = [];
        this.createdShapes = [];

        this.clear();
        this.initMainShapes();

        var _this = this;

        this.down = function down(e) {
            _this.onDown(e);
        };
        this.move = function move(e) {
            _this.onMove(e);
        };
        this.up = function up(e) {
            _this.onUp(e);
        };

        this.canvas.addEventListener("pointerdown", this.down);
        this.canvas.addEventListener("pointermove", this.move);
        this.canvas.addEventListener("pointerup", this.up);

        this.draw();

        //rotate an object (last answer):
        //https://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates
    }


    initMainShapes() {
        if (!(this.mainShapes.length > 0)) {
            const shapeData = require('../data/shapes.json');
            //var shapeData = JSON.parse('./data/shapes.json');
            for (let i = 0; i < shapeData.length; i++) {
                this.createShape(shapeData[i]);
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
            this.mainShapes[i].x = ((i * 2) % 10) * this.scale;
            this.mainShapes[i].y = Math.floor((i * 2) / 10) * 3 * this.scale;
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
        exit(this.canvas);
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

        if (isExit(this.width, pointerX, pointerY)) {
            this.canvas.removeEventListener('pointerdown', this.down);
            this.canvas.removeEventListener('pointermove', this.move);
            this.canvas.removeEventListener('pointerup', this.up);
            printMe(this.canvas);
        } else {
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