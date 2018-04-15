import { Triangle } from '../shapes/Triangle.js';
import { Square } from '../shapes/Square.js';
import { Parallelogram } from '../shapes/Parallelogram.js';
import smile from '../img/smile.png';
import printMe from '../print.js';

export class Easy {

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

        this.scale = this.width / 17;

        this.mainShapes = [];
        this.createdShapes = [];
        this.map = [];

        this.clear();
        this.initMainShapes();
        this.initMap();

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
            var elements = shapeData.shapes;
            for (let i = 0; i < elements.length; i++) {
                this.createShape(elements[i]);
            }
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

    setShapesPositions() {
        for (let i = 0; i < this.createdShapes.length; i++) {
            this.createdShapes[i].x = ((i * 2) % 17) * this.scale;
            this.createdShapes[i].y = Math.floor((i * 2) / 17) * 3 * this.scale;
        }
    }

    initMap() {
        if (!(this.map.length > 0)) {
            const mapData = require('../data/levels/rabbit.json');
            var elements = mapData.map;
            for (let i = 0; i < elements.length; i++) {
                this.drawMap(elements[i]);
            }
            this.setShapesPositions();
        }
    }

    drawMap(shapeData) {
        this.mainShapes.forEach(shape => {
            if (shapeData.name === shape.name) {
                var mapShape = this.addShape(shape, this.map);
                mapShape.x = shapeData.pos[0] * Math.round(this.scale);
                mapShape.y = shapeData.pos[1] * Math.round(this.scale);
                var createdShape = this.addShape(shape, this.createdShapes);
                for (let i = 0; i < shapeData.rotate; i++) {
                    mapShape.rotate();
                    createdShape.rotate();
                }
                mapShape.empty = true;
            }
        });
        this.setShapesPositions();
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
            this.createdShapes.forEach(shape => {
                shape.draw(this.context);
            });
            this.map.forEach(shape => {
                shape.draw(this.context);
            });
        } else {
            this.finish(this.context);
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

        for (let i = 0; i < this.createdShapes.length; i++) {
            if (this.createdShapes[i].isDragging && this.isPointerCloseToMap(e.clientX, e.clientY)) {
                var fit = this.createdShapes[i].findFit(this.map);
                if (fit != null) {
                    fit.accept(this.createdShapes[i]);
                    this.createdShapes.splice(i, 1);
                } else {
                    this.setShapesPositions();
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

    finish(context) {
        this.canvas.removeEventListener('pointerdown', this.down);
        this.canvas.removeEventListener('pointermove', this.move);
        this.canvas.removeEventListener('pointerup', this.up);

        this.clear();
        var width = this.width;
        var img = new Image(101, 155);
        img.onload = function () {
            context.drawImage(this, width / 2 - 101 / 2, width / 2 - 155 / 2);
        };

        img.src = smile;

        setTimeout(printMe.bind(null, this.canvas), 3000);
    }
}