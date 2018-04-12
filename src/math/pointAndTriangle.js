export default function check(point, node1, node2, node3, distX, distY){
    if(sign(point, node2, node1, distX, distY) < 0.0){
        return false;
    }
    else if(sign(point, node3, node2, distX, distY) < 0.0){
        return false;
    }
    else if(sign(point, node1, node3, distX, distY) < 0.0){
        return false;
    }
    else return true;
}

function sign(point, node1, node2, distX, distY) {
    return (point.x - (node2.x + distX)) * ((node1.y + distY) - (node2.y + distY)) - ((node1.x + distX) - (node2.x + distX)) * (point.y - (node2.y + distY));
}