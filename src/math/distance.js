export default function distance(point1, point2) {
    return parseFloat((Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y))).toPrecision(12));
}