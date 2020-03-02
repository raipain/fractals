import * as p5 from 'p5';

var parentId;
var height;
var width;
var length;
var lines: Line[] = [];
var iter = 0;

export class HTreePreview {
    private p5;

    constructor() { }

    init(pId, h, w) {
        parentId = pId;
        height = h;
        width = w;
        length = width / 2;
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
            p.frameRate(1);    
            let root = new Line(p.createVector(width / 2 - length / 2, height / 2), p.createVector(width / 2 + length / 2, height / 2));
            lines.push(root);
            p.line(root.A.x, root.A.y, root.B.x, root.B.y);
        }
        
        p.draw = () => {
            if(iter < 7) {
                let newBranches = [];
                for(let i = 0; i < lines.length; i++) {
                    let distance = p5.Vector.dist(lines[i].A, lines[i].B);
                    let lerp = (distance / Math.sqrt(2)) / distance;
                    let vectors = lines[i].expandLeft(p, lerp / 2);
                    newBranches.push(new Line(p.createVector(vectors[0].x, vectors[0].y), p.createVector(vectors[1].x, vectors[1].y)))
                    p.line(vectors[0].x, vectors[0].y, vectors[1].x, vectors[1].y);
                    vectors = lines[i].expandRight(p, lerp / 2);
                    newBranches.push(new Line(p.createVector(vectors[0].x, vectors[0].y), p.createVector(vectors[1].x, vectors[1].y)))
                    p.line(vectors[0].x, vectors[0].y, vectors[1].x, vectors[1].y);
                }
                lines = newBranches;
                iter++;
            }
            else {
                lines = [];
                iter = 0;
                p.setup();
            }
        }
    }
}

class Line {
    public A;
    public B;

    constructor(A, B) {
        this.A = A;
        this.B = B;
    }

    expandLeft(p: any, lerp: number) {
        let dir = p5.Vector.sub(this.A, this.B);
        dir.rotate(p.PI / 2);
        let ref = p5.Vector.add(this.A, dir)
        let halfRef = p5.Vector.lerp(this.A, ref, lerp);
        let ret1 = p.createVector(halfRef.x, halfRef.y);

        dir.rotate(-p.PI);
        ref = p5.Vector.add(this.A, dir);
        halfRef = p5.Vector.lerp(this.A, ref, lerp);
        let ret2 = p.createVector(halfRef.x, halfRef.y);

        return [ret1, ret2];
    }

    expandRight(p: any, lerp: number) {
        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(p.PI/2);
        let ref = p5.Vector.add(this.B, dir)
        let halfRef = p5.Vector.lerp(this.B, ref, lerp);
        let ret1 = p.createVector(halfRef.x, halfRef.y);

        dir.rotate(-p.PI);
        ref = p5.Vector.add(this.B, dir);
        halfRef = p5.Vector.lerp(this.B, ref, lerp);
        let ret2 = p.createVector(halfRef.x, halfRef.y);

        return [ret1, ret2];
    }
}