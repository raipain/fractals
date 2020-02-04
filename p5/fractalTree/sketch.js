let length = 50;
let lines = [];
let iter = 0;
let lerpAmount = 1;
let angle;

function setup() {
    createCanvas(800, 600);
    background(220);
    frameRate(1);
    lines.push({x1: 800/2, y1: 600, x2: 800/2, y2: 600-length});
    line(lines[0].x1, lines[0].y1, lines[0].x2, lines[0].y2);
    angle = PI/4;
}

function draw() {
    lerpAmount -= 0.075;
    let newLines = [];
    for(let i = 0; i < lines.length; i++) {
        let vect1 = createVector(lines[i].x1, lines[i].y1);
        let vect2 = createVector(lines[i].x2, lines[i].y2);
        let dir = p5.Vector.sub(vect2, vect1);
        dir.rotate(angle);
        let rotatedEnd = p5.Vector.add(vect2, dir);
        let newEnd = p5.Vector.lerp(vect2, rotatedEnd, lerpAmount);
        line(lines[i].x2, lines[i].y2, newEnd.x, newEnd.y);
        newLines.push({x1: lines[i].x2, y1: lines[i].y2, x2: newEnd.x, y2: newEnd.y});
        dir.rotate(-angle * 2);
        rotatedEnd = p5.Vector.add(vect2, dir);
        newEnd = p5.Vector.lerp(vect2, rotatedEnd, lerpAmount);
        line(lines[i].x2, lines[i].y2, newEnd.x, newEnd.y);
        newLines.push({x1: lines[i].x2, y1: lines[i].y2, x2: newEnd.x, y2: newEnd.y});
    }   
    lines = newLines;
}

function calculateRotatedValues(x1, y1, x2, y2, angle) {
    let x = x2 + ((x1 - x2) * cos(angle)) - ((y1 - y2) * sin(angle));
    let y = y2 + ((x1 - x2) * sin(angle)) + ((y1 - y2) * cos(angle));

    return [x, y];
}

