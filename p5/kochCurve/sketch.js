let width = 800;
let height = 600;
let length = 500;
let lines = [];
let iter = 0;

function setup() {
    createCanvas(width, height);
    frameRate(1);
    background(220);
    stroke(0);
    let root = new Line(createVector(width/2-length/2, height/2), 
                        createVector(width/2+length/2, height/2), length);
    lines.push(root);
    line(root.a.x, root.a.y, root.b.x, root.b.y);
}
  
function draw() {
    if(iter < 10) {
        background(220);
        let newLines = [];
        for(let i = 0; i < lines.length; i++) {
            let temp = lines[i].expand();
            for(let j = 0; j < temp.length; j++) {
                newLines.push(temp[j]);
            }
        }
        lines = newLines;
        iter++;
    }
}

class Line {
    constructor(a, b, length) {
        this.a = a;
        this.b = b;
        this.length = length;
    }

    expand() {
        let lerpVal = (this.length/3) / this.length;

        let first = p5.Vector.lerp(this.a, this.b, lerpVal);
        let second = p5.Vector.lerp(this.b, this.a, lerpVal);
        let dir = p5.Vector.sub(this.b, this.a);
        dir.rotate(-PI/3);
        let firstRef = p5.Vector.add(first, dir);
        dir = p5.Vector.sub(this.a, this.b);
        dir.rotate(PI/3);
        let secRef = p5.Vector.add(second, dir);
    
        firstRef = p5.Vector.lerp(first, firstRef, lerpVal);
        secRef = p5.Vector.lerp(second, secRef, lerpVal);

        line(first.x, first.y, firstRef.x, firstRef.y);
        line(second.x, second.y, secRef.x, secRef.y);  
        line(this.a.x, this.a.y, first.x, first.y);  
        line(this.b.x, this.b.y, second.x, second.y);  

        let newLines = [];
        newLines.push(new Line(this.a, first, p5.Vector.dist(this.a, first)));
        newLines.push(new Line(first, firstRef, p5.Vector.dist(firstRef, first)));
        newLines.push(new Line(secRef, second, p5.Vector.dist(secRef, second)));
        newLines.push(new Line(second, this.b, p5.Vector.dist(this.b, second)));

        return newLines;
    }
}