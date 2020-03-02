import * as p5 from 'p5';
import { AnimationStateManagerService } from '../services/animation-state-manager.service';
import { BehaviorSubject } from 'rxjs';

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
    protected list: Array<any>;
    protected rollBack: boolean;
    protected rollBackTo: number;
    protected rollBackList$: BehaviorSubject<Array<any>>;

    constructor(protected animationStateManagerService: AnimationStateManagerService) {
        this.play = false;
        this.stop = true;
        this.rollBack = false;
        this.frameRate = 1;
        this.strokeWeight = 1;
        this.color = "#000";
        this.list = [];
        this.rollBackList$ = new BehaviorSubject<Array<any>>(this.list);
        this.sketch = this.sketch.bind(this);
    }

    init(parentId: string, width: number, height: number, canvasColor: string): void {
        this.parentId = parentId;
        this.width = width;
        this.height = height;
        this.canvasColor = canvasColor;
    }

    abstract sketch(p: any): void;

    _rollBack(p: any) {
        if(this.rollBack) {
            if(this.play) {
              for(let i = this.rollBackTo; i < this.list.length; i++) {
                this.list[i].draw(p);
              }
              this.rollBack = false;
            }
            else {
              p.background(this.canvasColor);
              for(let i = 0; i < this.rollBackTo; i++) {
                this.list[i].draw(p);
              }
            }
        }
    }

    createCanvas(): void {
        this.p5 = new p5(this.sketch);
    }

    removeCanvas(): void {
        this.p5.remove();
    }

    clearCanvas(): void {
        this.p5.clear();
    }

    saveCanvas(): void {
        this.p5.save(this.canvas, "myFractal.jpg");
    }

    getStatus(): boolean {
      return this.play;
    }

    togglePlay(): void {
        this.play = !this.play;
        if(this.play) {
            this.stop = false;
        }
    }

    setStop(): void {
        this.play = false;
        this.stop = true;
        this.rollBack = false;
        this.animationStateManagerService.setState(false);
        this.rollBackList$.next(this.list);
        this.p5.clear();
    }

    setSpeed(obj: any, speed: number): void {
        obj.frameRate = speed;
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
    }

    setStrokeWeight(obj: any, value: number): void {
        obj.strokeWeight = value;
    }

    setUpRollBack(to: number) {
        this.rollBack = true;
        this.rollBackTo = to;
        this.play = false;
    }

    getObservable() {
        return this.rollBackList$;
    }
}
