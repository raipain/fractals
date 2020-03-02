import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { BehaviorSubject } from 'rxjs';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';

export class SierpinskiTriangleConfigurable extends Fractal {
  private fixedPoints;
  private customPoints;
  private fixedRefPoint;
  private customRefPoint;
  private points;
  private refPoint;
  private setup: boolean;
  private lerpValue: number;
  private useFixedPoints: boolean;
  private customColors: boolean;
  private color1: string;
  private color2: string;
  private color3: string;
  private maxPoints: number;
  private currentPoints: number;

  constructor(animationStateManagerService: AnimationStateManagerService) {
    super(animationStateManagerService);
    this.useFixedPoints = true;
    this.maxPoints = 3;
    this.currentPoints = 0;
    this.lerpValue = 0.5;
    this.customPoints = [];
    this.fixedPoints = [];
    this.setup = false;
    this.strokeWeight = 3;
    this.frameRate = 60;
  }

  init(parentId: string, width: number, height: number, canvasColor: string) {
    super.init(parentId, width, height, canvasColor);
    this.createCanvas();
  }

  sketch(p: any) {
    p.setup = () => {
      this.canvas = p.createCanvas(this.width, this.height);
      this.canvas.parent(this.parentId);
      this.canvas.mousePressed(p.handleMousePressed);

      p.background(this.canvasColor);
      p.stroke(this.color);
      p.strokeWeight(this.strokeWeight);
      p.frameRate(this.frameRate);

      this.fixedPoints.push(p.createVector(this.width / 2, 5));
      this.fixedPoints.push(p.createVector(5, this.height - 5));
      this.fixedPoints.push(p.createVector(this.width - 5, this.height - 5));
      this.fixedRefPoint = p.createVector(this.width / 2, this.height / 2);

      this.points = this.fixedPoints;
      this.refPoint = this.fixedRefPoint;
    };

    p.draw = () => {
      this.setConfigurables(p);

      if(this.rollBack) {
        this._rollBack(p);
      }
      if(this.play && !this.useFixedPoints && !this.setup) {
        p.setUpCustomPoints();
      }
      else if(this.play && this.useFixedPoints && !this.setup) {
        p.point(this.fixedPoints[0].x, this.fixedPoints[0].y);
        p.point(this.fixedPoints[1].x, this.fixedPoints[1].y);
        p.point(this.fixedPoints[2].x, this.fixedPoints[2].y);
        p.point(this.fixedRefPoint.x, this.fixedRefPoint.y);
        this.setup = true;
      }
      else if(this.play) {
        let rand = p.floor(p.random(3));

        if(this.customColors && rand == 0) p.stroke(this.color1);
        else if(this.customColors && rand == 1) p.stroke(this.color2);
        else if(this.customColors && rand == 2) p.stroke(this.color3);

        let newPoint = p5.Vector.lerp(this.points[rand], this.refPoint, this.lerpValue);
        p.point(newPoint.x, newPoint.y);
        this.refPoint = newPoint;

        this.list.push(new Point(newPoint));
        this.rollBackList$.next(this.list);
      }
    }

    p.setUpCustomPoints = () => {
      p.background(this.canvasColor);
      p.point(p.mouseX, p.mouseY);

      for(let i = 0; i < this.customPoints.length; i++) {
        p.point(this.customPoints[i].x, this.customPoints[i].y);
      }

      if(this.maxPoints + 1 == this.currentPoints) {
        this.setup = true;
        this.points = this.customPoints;
        this.refPoint = this.customRefPoint;
      }
    }

    p.handleMousePressed = () => {
      if(this.play && !this.useFixedPoints && this.currentPoints < this.maxPoints + 1) {
        this.currentPoints++;
        p.point(p.mouseX, p.mouseY);

        if(this.currentPoints <= this.maxPoints) {
          this.customPoints.push(p.createVector(p.mouseX, p.mouseY));
        }
        else if(this.currentPoints == this.maxPoints + 1) {
          this.customRefPoint = p.createVector(p.mouseX, p.mouseY);
        }
      }
    }
  };

  setCustomColors(obj: any, value: boolean) {
    obj.customColors = value
  }

  setColor1(obj: any, color: string) {
    obj.color1 = color;
  }

  setColor2(obj: any, color: string) {
    obj.color2 = color;
  }

  setColor3(obj: any, color: string) {
    obj.color3 = color;
  }

  setLerpValue(obj: any, value: number) {
    obj.lerpValue = value;
  }

  setUseFixedPoints(obj: any, value: boolean) {
    obj.useFixedPoints = value;
    obj.clearCanvas();
    obj.currentPoints = 0;
    obj.customPoints = [];
    obj.setup = false;

    if(value) {
      obj.points = obj.fixedPoints;
      obj.refPoint = obj.fixedRefPoint
    }
    else {
      obj.points = [];
      obj.refPoint = null;
    }
  }

  setConfigurables(p: any) {
    p.frameRate(this.frameRate);
    p.stroke(this.color);
    p.strokeWeight(this.strokeWeight);
  }

  setStop() {
    super.setStop();
    this.setup = false;
    this.customPoints = [];
    this.customRefPoint = null;
    this.currentPoints = 0;
  }  
}

class Point {
  public point: p5.Vector;

  constructor(point: p5.Vector) {
    this.point = point;
  }

  draw(p: any) {
    p.point(this.point.x, this.point.y);
  }
}
