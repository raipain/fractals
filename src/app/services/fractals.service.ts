import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SierpinskiTrianglePreview } from '../algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiCarpetPreview } from '../algorithms/sierpinski-carpet/sierpinski-carpet-prev';
import { IFractalList } from '../models/fractal-list';
import { SierpinskiCarpetConfigurable } from '../algorithms/sierpinski-carpet/sierpinski-carpet-conf';
import { SierpinskiTriangleConfigurable } from '../algorithms/sierpinski-triangle/sierpinski-triangle-conf';
import { LevyCCurvePreview } from '../algorithms/levy-c-curve/levy-c-curve-preview';
import { PythagorasTreePreview } from '../algorithms/pythagoras-tree/pythagoras-tree-preview';
import { KochCurvePreview } from '../algorithms/koch-curve/koch-curve-preview';
import { LevyCCurveConfigurable } from '../algorithms/levy-c-curve/levy-c-curve-conf';
import { KochCurveConfigurable } from '../algorithms/koch-curve/koch-curve-conf';
import { PythagorasTreeConfigurable } from '../algorithms/pythagoras-tree/pythagoras-tree-conf';

@Injectable({
  providedIn: 'root'
})

export class FractalsService {

  list = new Array<IFractalList>();
  activeFractal = new BehaviorSubject<number>(null);

  constructor(private sierpinskiTrianglePreview: SierpinskiTrianglePreview, 
              private sierpinskiTriangleConfigurable: SierpinskiTriangleConfigurable, 
              private sierpc: SierpinskiCarpetPreview, 
              private sierpinskiCarpetConfigurable: SierpinskiCarpetConfigurable, 
              private levyC: LevyCCurvePreview, 
              private levyCCurveConfigurable: LevyCCurveConfigurable,
              private pythTree: PythagorasTreePreview,
              private pythagorasTreeConfigurable: PythagorasTreeConfigurable,
              private kochCurvePreview: KochCurvePreview,
              private kochCurveConfigurable: KochCurveConfigurable)
  {
      this.list.push({
        name: "Sierpinszki háromszög", 
        previewId: "sierpinski-triangle-preview", 
        preview: this.sierpinskiTrianglePreview, 
        algorithm: this.sierpinskiTriangleConfigurable,
        configurations: [
          { 
            name: "Gyorsaság",
            type: "slider",
            value: 60,
            minValue: 1,
            maxValue: 200,
            step: 1,
            func: this.sierpinskiTriangleConfigurable.setSpeed
          },
          { 
            name: "Pontvastagság",
            type: "slider",
            value: 3,
            minValue: 1,
            maxValue: 10,
            step: 1,
            func: this.sierpinskiTriangleConfigurable.setStrokeWeight
          },
          {
            name: "Pontok közötti távolság",
            type: "slider",
            value: 0.5,
            minValue: 0.1,
            maxValue: 1,
            step: 0.1,
            func: this.sierpinskiTriangleConfigurable.setLerpValue
          },
          { 
            name: "Fixált kezdőpontok",
            type: "checkbox",
            value: 1,
            func: this.sierpinskiTriangleConfigurable.setUseFixedPoints
          },
          { 
            name: "Háromszög részeinek kijelölése",
            type: "checkbox-tree",
            value: 0,
            func: this.sierpinskiTriangleConfigurable.setCustomColors,
            configurations: [
              {
                name: "Szín 1",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor1
              },
              {
                name: "Szín 2",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor2
              },
              {
                name: "Szín 3",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor3
              }
            ]
          },
          { 
            name: "Szín",
            type: "colorpicker",
            color: "#000",
            func: this.sierpinskiTriangleConfigurable.setColor
          }
        ] 
    });
    this.list.push({
      name: "Sierpinszki szőnyeg", 
      previewId: "sierpc", 
      preview: this.sierpc, 
      algorithm: this.sierpinskiCarpetConfigurable,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 60,
          step: 1,
          func: this.sierpinskiCarpetConfigurable.setSpeed
        },
        { 
          name: "Szín",
          type: "colorpicker",
          func: this.sierpinskiCarpetConfigurable.setColor
        }
      ]
    });
    this.list.push({
      name: "Levy C Görbe", 
      previewId: "levy-c-curve-preview", 
      preview: this.levyC, 
      algorithm: this.levyCCurveConfigurable,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 60,
          step: 1,
          func: this.levyCCurveConfigurable.setSpeed
        },
        { 
          name: "Szín",
          type: "colorpicker",
          func: this.levyCCurveConfigurable.setColor
        },
        { 
          name: "Vonalvastagság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 10,
          step: 1,
          func: this.levyCCurveConfigurable.setStrokeWeight
        },
        { 
          name: "Vonalhosszúság",
          type: "slider",
          value: 1,
          minValue: 10,
          maxValue: 400,
          step: 1,
          func: this.levyCCurveConfigurable.setLength
        },
        { 
          name: "Fixált kezdővonal",
          type: "checkbox",
          value: 1,
          func: this.levyCCurveConfigurable.setFixedLine
        },
        { 
          name: "Irány",
          type: "combobox",
          values: [
            {
              name: "Fel",
              value: -1
            },
            {
              name: "Le",
              value: 1
            }
          ],
          func: this.levyCCurveConfigurable.setDirection
        },
      ]
    });
    this.list.push({
      name: "Püthagorasz Fa", 
      previewId: "pythagoras-tree-prev", 
      preview: this.pythTree, 
      algorithm: this.pythagorasTreeConfigurable,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 60,
          step: 1,
          func: this.pythagorasTreeConfigurable.setSpeed
        },
        { 
          name: "Szín",
          type: "colorpicker",
          func: this.pythagorasTreeConfigurable.setColor
        }
      ]
    });
    this.list.push({
      name: "Koch Görbe", 
      previewId: "koch-curve-preview", 
      preview: this.kochCurvePreview, 
      algorithm: this.kochCurveConfigurable,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 60,
          step: 1,
          func: this.kochCurveConfigurable.setSpeed
        },
        { 
          name: "Szín",
          type: "colorpicker",
          func: this.kochCurveConfigurable.setColor
        },
        { 
          name: "Vonalvastagság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 10,
          step: 1,
          func: this.kochCurveConfigurable.setStrokeWeight
        }
      ]
    });
  }

  public getList() {
    return this.list;
  }

  public getSelectedFractal(): Observable<number> {
    return this.activeFractal;
  }

  public selectFractal(index: number) {
    this.activeFractal.next(index);
  }
}
