import * as p5 from 'p5';

var parentId;
var width = 800;
var height = 600;
var length = 200;
var rectSize = 25;
var rects = [];
var iter = 0;
var angle;

export class PythagorasTreePreview {
    private p5;

    constructor() { }

    init(pId, h, w) {
        parentId = pId;
        height = h;
        width = w;
        this.createCanvas();
    }

    createCanvas() {
        this.p5 = new p5(this.sketch);
    }

    private sketch(p: any) {
        p.setup = () => {
            let canvas = p.createCanvas(width, height);
            canvas.parent(parentId);
            p.background("#cbcbcb");
            p.noStroke();
            p.fill(0);
            p.frameRate(1);
            rects.push(new Rectangle(p.createVector(width/2-rectSize/2, height/1.25-rectSize), p.createVector(width/2+rectSize/2, height/1.25-rectSize), 0));
            p.rect(rects[0].posA.x, rects[0].posA.y, rects[0].size, rects[0].size);
        }

        p.draw = () => {
            if(iter < 5) {
                let newRects = [];
                for(let i = 0; i < rects.length; i++) {
                    let retVal = rects[i].branch(p, iter + 1);
                    newRects.push(retVal[0]);
                    newRects.push(retVal[1]);
                }
                rects = newRects;
                iter++;
            }
            else {
                iter = 0;
                rects = [];
                p.setup();
            }
        }
    }
}

class Rectangle {
    posA;
    posB;
    rotation;
    size;

    constructor(posA, posB, rotation) {
        this.posA = posA;
        this.posB = posB;
        this.rotation = rotation;
        this.size = p5.Vector.dist(posA, posB);
    }

    branch(p, iter) {
        let left, right, newA, newB, dir, ref, offset;
        let width = Math.sqrt((this.size*this.size)/2);
        let lerp = width/this.size;
        
        p.push();
        p.translate(this.posA.x, this.posA.y);
        p.rotate(this.rotation);
        p.rotate(-p.PI/4);
        p.rect(0, -width, width, width);
        p.pop();
        p.push()
        p.translate(this.posB.x, this.posB.y);
        p.rotate(this.rotation);
        p.rotate(p.PI/4);
        p.rect(0, -width, -width, width);
        p.pop();

        dir = p5.Vector.sub(this.posA, this.posB);
        dir.rotate(p.PI/4);
        ref = p5.Vector.add(this.posA, dir);
        offset = p5.Vector.lerp(this.posA, ref, lerp);
        
        newA = offset;
        
        dir = p5.Vector.sub(newA, this.posA);
        dir.rotate(p.PI/2);
        ref = p5.Vector.add(newA, dir);
        offset = p5.Vector.lerp(newA, ref, 1);

        newB = offset;
        left = new Rectangle(newA, newB, this.rotation - p.PI/4);

        dir = p5.Vector.sub(this.posB, this.posA);
        dir.rotate(-p.PI/4);
        ref = p5.Vector.add(this.posB, dir);
        offset = p5.Vector.lerp(this.posB, ref, lerp);

        newA = offset;
        
        dir = p5.Vector.sub(newA, this.posB);
        dir.rotate(-p.PI/2);
        ref = p5.Vector.add(newA, dir);
        offset = p5.Vector.lerp(newA, ref, 1);

        newB = offset;
        right = new Rectangle(newB, newA, this.rotation + p.PI/4);
    
        return [left, right];
    }
}

