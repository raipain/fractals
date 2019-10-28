import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SierpinskiTriangleDialogComponent } from './sierpinski-triangle-dialog/sierpinski-triangle-dialog.component';
import * as p5 from 'p5';

var started = true;
var setup = true;
var loop = 0;

@Component({
  selector: 'app-sierpinski-triangle',
  templateUrl: './sierpinski-triangle.component.html',
  styleUrls: ['./sierpinski-triangle.component.scss']
})
export class SierpinskiTriangleComponent implements OnInit {

  private p5;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(SierpinskiTriangleDialogComponent, {
      width: '80%',
      height: '95%'
    });
  }

  ngOnInit() {
    this.createCanvas();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
    let points: {x: number, y: number}[] = [
      { "x": 100, "y": 10 },
      { "x": 10, "y": 190 },
      { "x": 190, "y": 190 }
    ];
    let startingPoint: {x: number, y: number};
    
    p.setup = () => {
      let canvas = p.createCanvas(200, 200);
      canvas.parent('sierp');
      p.stroke(0);
      p.strokeWeight(3);
    };
  
    p.draw = () => {
      if(setup) {
        p.point(points[0].x, points[0].y);
        p.point(points[1].x, points[1].y);
        p.point(points[2].x, points[2].y);
        startingPoint = { "x": 190, "y": 190 };
        setup = false;
      }
      if(started) {
        loop++;
        let rand = p.floor(p.random(3));
        let x = p.lerp(points[rand].x, startingPoint.x, 0.5);
        let y = p.lerp(points[rand].y, startingPoint.y, 0.5);
        p.point(x, y);    
        startingPoint = {"x": x, "y": y};

        if(loop > 1000) {
          p.clear();
          setup = true;
          loop = 0;
        }
      }
      else {
        p.clear();
      }
    };
  }
}
