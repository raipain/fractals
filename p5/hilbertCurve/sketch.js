let width = 800;
let height = 600;
let length = 100;
let padding = 10;
let curves = [];
let iter = 0;

function setup() {
    createCanvas(width, height);
    background(220);
    strokeWeight(5);
    stroke(255);
    frameRate(1);
    let root = new Curve(createVector(width/2 - length/2, height/2 + length/2), length);
    root.draw();
}

function draw() {
    for(let i = 1; i < 5; i++) {
        
    }
}

class Curve {
    constructor(a, length) {
        this.a = a;
        this.length = length;
    }

    draw() {
        this.b = createVector(this.a.x, this.a.y - this.length);
        this.c = p5.Vector.sub(this.b, this.a);
        this.c.rotate(PI/2);
        this.c = p5.Vector.add(this.b, this.c);
        this.d = p5.Vector.sub(this.c, this.b);
        this.d.rotate(PI/2);
        this.d = p5.Vector.add(this.c, this.d);
        
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        line(this.b.x, this.b.y, this.c.x, this.c.y);
        line(this.c.x, this.c.y, this.d.x, this.d.y);
    } 

    expand() {
        let right = new Curve(createVector(this.a.x + this.length * 2, this.a.y), length);
        line(this.d.x, this.d.y, right.a.x, right.a.y)
        right.draw();
        push();
        line(this.a.x, this.a.y, this.a.x, this.a.y  + this.length);
        translate(this.a.x, this.a.y  + this.length);
        rotate(PI/2);
        let bottomLeft = new Curve(createVector(0, 0), length);
        bottomLeft.draw();
        pop();
        push();
        line(right.d.x, right.d.y, right.d.x, right.d.y + length);
        translate(right.d.x, right.d.y + 2 * length);
        rotate(-PI/2);
        let bottomRight = new Curve(createVector(0, 0), length);
        bottomRight.draw();
        pop();  
    }

}

;