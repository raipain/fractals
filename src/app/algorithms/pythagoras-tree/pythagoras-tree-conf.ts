import * as p5 from 'p5';
import { Fractal } from '../fractal';

export class PythagorasTreeConfigurable extends Fractal {

    private rectSize: number;
    private rects: Rectangle[];
    private root: Rectangle;
    private iter: number;

    constructor() {
        super();
        this.rectSize = 75;
        this.iter = 0;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.root = new Rectangle(new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25 - this.rectSize), 
                                    new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25 - this.rectSize), 0);
        this.rects = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            p.background(this.canvasColor);
            p.noStroke();
            p.fill(this.color);
            p.frameRate(this.frameRate);
            
            p.rect(this.rects[0].posA.x, this.rects[0].posA.y, this.rects[0].size, this.rects[0].size);
        }

        p.draw = () => {
            this.setConfigurables(p);
            if(this.play) {
                let newRects = [];
                for(let i = 0; i < this.rects.length; i++) {
                    let retVal = this.rects[i].branch(p, this.iter + 1);
                    newRects.push(retVal[0]);
                    newRects.push(retVal[1]);
                }
                this.rects = newRects;
                this.iter++;    
            }
        }  
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.fill(this.color);
    }

    setStop() {
        super.setStop();
        this.rects = [this.root];
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

