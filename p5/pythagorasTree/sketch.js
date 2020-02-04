let width = 800;
let height = 600;
let length = 200;
let rectSize = 75;
let rects = [];
let iter = 0;
let angle;

function setup() {
    createCanvas(width, height);
    background(220);
    noStroke();
    frameRate(1);
    rects.push(new Rectangle(createVector(width/2-rectSize/2, height-rectSize), createVector(width/2+rectSize/2, height-rectSize), 0));
    rect(rects[0].posA.x, rects[0].posA.y, rects[0].size, rects[0].size);
}

function draw() {

    if(iter < 8) {
        let newRects = [];
        for(let i = 0; i < rects.length; i++) {
            retVal = rects[i].branch(iter + 1);
            newRects.push(retVal[0]);
            newRects.push(retVal[1]);
        }
    
        rects = newRects;
    }
    iter++;
}


class Rectangle {
    constructor(posA, posB, rotation) {
        this.posA = posA;
        this.posB = posB;
        this.rotation = rotation;
        this.size = p5.Vector.dist(posA, posB);
    }

    branch(iter) {
        let left, right, newA, newB, dir, ref, offset;
        let width = sqrt((this.size*this.size)/2);
        let lerp = width/this.size;
        
        push();
        translate(this.posA.x, this.posA.y);
        rotate(this.rotation);
        rotate(-PI/4);
        rect(0, -width, width, width);
        pop();
        push()
        translate(this.posB.x, this.posB.y);
        rotate(this.rotation);
        rotate(PI/4);
        rect(0, -width, -width, width);
        pop();

        dir = p5.Vector.sub(this.posA, this.posB);
        dir.rotate(PI/4);
        ref = p5.Vector.add(this.posA, dir);
        offset = p5.Vector.lerp(this.posA, ref, lerp);
        
        newA = offset;
        
        dir = p5.Vector.sub(newA, this.posA);
        dir.rotate(PI/2);
        ref = p5.Vector.add(newA, dir);
        offset = p5.Vector.lerp(newA, ref, 1);

        newB = offset;
        left = new Rectangle(newA, newB, this.rotation - PI/4);

        dir = p5.Vector.sub(this.posB, this.posA);
        dir.rotate(-PI/4);
        ref = p5.Vector.add(this.posB, dir);
        offset = p5.Vector.lerp(this.posB, ref, lerp);

        newA = offset;
        
        dir = p5.Vector.sub(newA, this.posB);
        dir.rotate(-PI/2);
        ref = p5.Vector.add(newA, dir);
        offset = p5.Vector.lerp(newA, ref, 1);

        newB = offset;
        right = new Rectangle(newB, newA, this.rotation + PI/4);
    
        return [left, right];
    }
}

