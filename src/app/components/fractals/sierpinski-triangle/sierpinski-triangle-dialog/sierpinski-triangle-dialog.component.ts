import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as p5 from 'p5';

const ALLOWED_POINTS = 3;
var started = false;
var setup = false;
var _default = true;
var highlight = false;
var clear = false;
var lerp = 0.5;

const defaultPoints: {x: number, y: number}[] = [
  { "x": 250, "y": 10}, 
  { "x": 10, "y": 490}, 
  { "x": 490, "y": 490}
];
var customPoints: {x: number, y: number}[] = [];
const defaultStartingPoint: {x: number, y: number} = {"x": 250, "y": 250};
var customStartingPoint: {x: number, y: number} = null;

@Component({
  selector: 'app-sierpinski-triangle-dialog',
  templateUrl: './sierpinski-triangle-dialog.component.html',
  styleUrls: ['./sierpinski-triangle-dialog.component.scss']
})
export class SierpinskiTriangleDialogComponent implements OnInit, OnDestroy {
  
  private p5;
  highlight = false;
  lerp = 0.5;

  constructor(private dialogRef: MatDialogRef<SierpinskiTriangleDialogComponent>) {
    started = false;
    setup = false;
    _default = true;
    highlight = false;
    clear = false;
    customPoints = [];
    customStartingPoint = null;
  }

  changeLerp() {
    lerp = this.lerp;
    this.stop();
  }

  start() {
    setup = true;
  }

  pause() {
    started = false;
  }

  stop() {
    setup = false;
    started = false;
    clear = true;
    customPoints = [];
    customStartingPoint = null;
  }

  toggleHighlight() {
    highlight = !this.highlight;
    this.stop();
  }

  toggleDefault(value) {
    _default = value;
    this.stop();
  }
  
  ngOnInit() {
    this.createCanvas();
  }

  ngOnDestroy() {
    setup = false;
    started = false;
    clear = true;
    customPoints = [];
    customStartingPoint = null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
    let trianglePoints: {x: number, y: number}[];
    let startingPoint: {x: number, y: number};
    
    p.setup = () => {
      let canvas = p.createCanvas(500, 500);
      canvas.parent('canvas');
      canvas.mouseClicked(p.handleClick)
      p.stroke(0);
      p.strokeWeight(3);
    };
  
    p.draw = () => {
      if(setup && _default) {
        trianglePoints = defaultPoints;
        startingPoint = defaultStartingPoint;

        p.point(trianglePoints[0].x, trianglePoints[0].y);
        p.point(trianglePoints[1].x, trianglePoints[1].y);
        p.point(trianglePoints[2].x, trianglePoints[2].y);

        setup = false;
        started = true;
      }
      else if(setup && !_default && customStartingPoint != null) {
        trianglePoints = customPoints;
        startingPoint = customStartingPoint;

        setup = false;
        started = true;
      }
      if(started) {
        p.stroke(0);
        let rand = p.floor(p.random(3));
        let x = p.lerp(trianglePoints[rand].x, startingPoint.x, lerp);
        let y = p.lerp(trianglePoints[rand].y, startingPoint.y, lerp);
        if(highlight && rand == 0) {
          p.stroke(255, 0, 0);
        }
        else if(highlight && rand == 1) {
          p.stroke(0, 255, 0);
        }
        else if(highlight && rand == 2) {
          p.stroke(0, 0, 255);
        }
        p.point(x, y);    
        startingPoint = {"x": x, "y": y};
      }
      if(clear) {
        p.clear();
        clear = false;
      }
    };

    p.handleClick = () => {
      if(setup && !_default && customPoints.length < ALLOWED_POINTS) {
        p.point(p.mouseX, p.mouseY);
        console.log(p.mouseX, p.mouseY);
        customPoints.push({"x": p.mouseX, "y": p.mouseY});
      }
      else if(setup && !_default && customPoints.length == ALLOWED_POINTS && !started) {
        p.point(p.mouseX, p.mouseY);
        customStartingPoint = {"x": p.mouseX, "y": p.mouseY};
      }
    };
  }

}
