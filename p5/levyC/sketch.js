let length = 200;
let lines = [
    {
        x1: 800/2-length/2,
        y1: 600/2,
        x2: 800/2+length/2,
        y2: 600/2 
    }
];
let iter = 0;

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

function setup() {
    createCanvas(800, 600);
    background(220);
    line(800/2-length/2, 600/2, 800/2+length/2, 600/2)
    frameRate(1);
}

function draw() {
    if(iter < 20) {
        background(220);
        let tempLines = [];
        for(let i = 0; i < lines.length; i++) {
            let length = calculateLength(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
            let lengthSz = sqrt(length/2 * length);

            let x1 = lines[i].x1 + ((lines[i].x2 - lines[i].x1) * cos(-PI/4)) - ((lines[i].y2 - lines[i].y1) * sin(-PI/4));
            let y1 = lines[i].y1 + ((lines[i].x2 - lines[i].x1) * sin(-PI/4)) + ((lines[i].y2 - lines[i].y1) * cos(-PI/4));
            
            let x2 = lines[i].x2 + ((lines[i].x1 - lines[i].x2) * cos(PI/4)) - ((lines[i].y1 - lines[i].y2) * sin(PI/4));
            let y2 = lines[i].y2 + ((lines[i].x1 - lines[i].x2) * sin(PI/4)) + ((lines[i].y1 - lines[i].y2) * cos(PI/4));

            let lerpAmount = lengthSz/calculateLength(lines[i].x1, lines[i].y1, x1, y1);
            let vect1 = p5.Vector.lerp(createVector(lines[i].x1, lines[i].y1), createVector(x1, y1), lerpAmount);
            let vect2 = p5.Vector.lerp(createVector(lines[i].x2, lines[i].y2), createVector(x2, y2), lerpAmount);

            line(lines[i].x1, lines[i].y1, vect1.x, vect1.y);
            line(vect2.x, vect2.y, lines[i].x2, lines[i].y2);

            tempLines.push({x1: lines[i].x1, y1: lines[i].y1, x2: vect1.x, y2: vect1.y});
            tempLines.push({x1: vect2.x, y1: vect2.y, x2: lines[i].x2, y2: lines[i].y2});
        }
        lines = tempLines;
        iter++;
    }
}

function calculateLength(x1, y1, x2, y2) {
    let lengthX = abs(x1 - x2);
    let lengthY = abs(y1 - y2);
    let length = sqrt(lengthX*lengthX + lengthY*lengthY);

    return length;
}

