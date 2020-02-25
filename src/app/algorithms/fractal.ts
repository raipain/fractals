import * as p5 from 'p5';

export abstract class Fractal {
    protected p5: any;
    protected canvas: any;

    protected width: number;
    protected height: number;
    protected canvasColor: string;
    protected parentId: string;
    protected frameRate: number;
    protected strokeWeight: number;
    protected color: string;
    protected play: boolean;
    protected stop: boolean;

    constructor() {
        this.play = false;
        this.stop = true;
        this.frameRate = 1;
        this.strokeWeight = 1;
        this.color = "#000";
        this.sketch = this.sketch.bind(this);
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        this.parentId = parentId;
        this.width = width;
        this.height = height;
        this.canvasColor = canvasColor;
    }

    abstract sketch(p: any): void;

    createCanvas() {
        this.p5 = new p5(this.sketch);
    }

    removeCanvas() {
        this.p5.remove();
    }

    clearCanvas() {
        this.p5.clear();
    }

    saveCanvas() {
        this.p5.save(this.canvas, "myFractal.jpg");
    }

    getStatus(): boolean {
      return this.play;
    }

    togglePlay() {
        this.play = !this.play;
        if(this.play) {
            this.stop = false;
        }
    }

    setStop() {
        this.play = false;
        this.stop = true;
        this.p5.clear();
    }

    setSpeed(obj: any, speed: number) {
        obj.frameRate = speed;
    }

    setColor(obj: any, color: string) {
        obj.color = color;
    }

    setStrokeWeight(obj: any, value: number) {
        obj.strokeWeight = value;
    }
}
