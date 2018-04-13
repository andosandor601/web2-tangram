import { Triangle } from '../shapes/Triangle.js';
import { Square } from '../shapes/Square.js';
import { Parallelogram } from '../shapes/Parallelogram.js';

export class Rabbit {

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
        this.map = [];

        this.clear();
        this.initMainShapes();
        this.initMap();

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

    initMap() {
        if (!(this.map.length > 0)) {
            const mapData = require('../data/levels/rabbit.json');
            var elements = mapData.map;
            for (let i = 0; i < elements.length; i++) {
                this.drawMap(elements[i]);
            }
            this.setMainShapesPositions();
        }
    }

    drawMap(shapeData) {
        this.mainShapes.forEach(shape => {
            if (shapeData.name === shape.name) {
                var newShape = this.addShape(shape, this.map);
                newShape.x = shapeData.pos[0] * Math.round(this.scale);
                newShape.y = shapeData.pos[1] * Math.round(this.scale);
                for (let i = 0; i < shapeData.rotate; i++) {
                    newShape.rotate();
                }
                newShape.empty = true;
            }
        });
    }

    addShape(shape, container) {
        if (shape instanceof Triangle) {
            var triangle = new Triangle(shape, 1, this.scale, shape.color);
            triangle.name = shape.name;
            container.push(triangle);
            return triangle;
        } else if (shape instanceof Square) {
            var square = new Square(shape, 1, this.scale, shape.color);
            square.name = shape.name;
            container.push(square);
            return square;
        } else {
            var parallelogram = new Parallelogram(shape, 1, this.scale, shape.color);
            parallelogram.name = shape.name;
            container.push(parallelogram);
            return parallelogram;
        }
    }

    draw() {
        if (!this.isEnd()) {
            this.clear();
            this.mainShapes.forEach(shape => {
                shape.draw(this.context);
            });
            this.createdShapes.forEach(shape => {
                shape.draw(this.context);
            });
            this.map.forEach(shape => {
                shape.draw(this.context);
            });
        } else {
            this.clear();
            this.context.fillStyle = "blue";
            this.context.font = "small-caps bold 32px Arial";
            this.context.fillText("Vége", (this.canvas.width / 2) - 17, (this.canvas.height / 2) - 50);
            this.context.fill();
        }
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
                var newShape = this.addShape(shape, this.createdShapes);
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
        } else {
            for (let i = 0; i < this.createdShapes.length; i++) {
                if (this.createdShapes[i].isDragging && this.isPointerCloseToMap(e.clientX, e.clientY)) {
                    var fit = this.createdShapes[i].findFit(this.map);
                    if (fit != null) {
                        fit.accept(this.createdShapes[i]);
                    }
                    this.createdShapes.splice(i, 1);
                }

            }
        }

        this.dragok = false;
        this.wasMove = false;
        this.createdShapes.forEach(shape => {
            shape.isDragging = false;
        });

        this.draw();
    }

    isPointerCloseToMap(pointerX, pointerY) {
        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i].isCloseToPoint(pointerX, pointerY, 100)) {
                return true;
            }
        }
        return false;
    }

    isEnd() {
        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i].empty === true) {
                return false;
            }
        }
        return true;
    }
}