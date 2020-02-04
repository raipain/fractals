let width = 800;
let height = 600;
let length = 400;
let iter = 0;
let branches = [];

function setup() {
    createCanvas(width, height);
    background(220);
    frameRate(1);
    let root = new Branch(createVector(width/2-length/2, height/2), createVector(width/2+length/2, height/2));
    branches.push(root);
    line(root.start.x, root.start.y, root.end.x, root.end.y);
}

function draw() {
    if(iter < 10) {
        let newBranches = [];
        for(let i = 0; i < branches.length; i++) {
            let distance = p5.Vector.dist(branches[i].start, branches[i].end);
            let lerp = (distance / sqrt(2)) / distance;
            console.log(distance, lerp);
            let vectors = branches[i].firstBranch(lerp/2);
            newBranches.push(new Branch(createVector(vectors[0].x, vectors[0].y), createVector(vectors[1].x, vectors[1].y)))
            line(vectors[0].x, vectors[0].y, vectors[1].x, vectors[1].y);
            vectors = branches[i].secondBranch(lerp/2);
            newBranches.push(new Branch(createVector(vectors[0].x, vectors[0].y), createVector(vectors[1].x, vectors[1].y)))
            line(vectors[0].x, vectors[0].y, vectors[1].x, vectors[1].y);
        }
        branches = newBranches;
        iter++;
    }
}

class Branch {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    firstBranch(lerp) {
        let dir = p5.Vector.sub(this.start, this.end);
        dir.rotate(PI/2);
        let ref = p5.Vector.add(this.start, dir)
        let halfRef = p5.Vector.lerp(this.start, ref, lerp);
        let ret1 = createVector(halfRef.x, halfRef.y);

        dir.rotate(-PI);
        ref = p5.Vector.add(this.start, dir);
        halfRef = p5.Vector.lerp(this.start, ref, lerp);
        let ret2 = createVector(halfRef.x, halfRef.y);

        return [ret1, ret2];
    }

    secondBranch(lerp) {
        let dir = p5.Vector.sub(this.end, this.start);
        dir.rotate(PI/2);
        let ref = p5.Vector.add(this.end, dir)
        let halfRef = p5.Vector.lerp(this.end, ref, lerp);
        let ret1 = createVector(halfRef.x, halfRef.y);

        dir.rotate(-PI);
        ref = p5.Vector.add(this.end, dir);
        halfRef = p5.Vector.lerp(this.end, ref, lerp);
        let ret2 = createVector(halfRef.x, halfRef.y);

        return [ret1, ret2];
    }
}