import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SierpinskiTrianglePreview } from '../algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiCarpetPreview } from '../algorithms/sierpinski-carpet-prev';
import { IFractalList } from '../models/fractal-list';
import { SierpinskiCarpetConf } from '../algorithms/sierpinski-carpet-conf';
import { SierpinskiTriangleConfigurable } from '../algorithms/sierpinski-triangle/sierpinski-triangle-conf';
import { LevyCCurvePreview } from '../algorithms/levy-c-curve/levy-c-curve-preview';
import { PythagorasTreePreview } from '../algorithms/pythagoras-tree/pythagoras-tree-preview';
import { KochCurvePreview } from '../algorithms/koch-curve/koch-curve-preview';

@Injectable({
  providedIn: 'root'
})

export class FractalsService {

  list = new Array<IFractalList>();
  activeFractal = new BehaviorSubject<number>(null);

  constructor(private sierpinskiTrianglePreview: SierpinskiTrianglePreview, 
              private sierpinskiTriangleConfigurable: SierpinskiTriangleConfigurable, 
              private sierpc: SierpinskiCarpetPreview, private sierpcC: SierpinskiCarpetConf, 
              private levyC: LevyCCurvePreview, 
              private pythTree: PythagorasTreePreview, 
              private kochCurvePreview: KochCurvePreview) 
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
          name: "Fixált kezdőpontok",
          type: "checkbox",
          value: 1
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
      algorithm: this.sierpcC,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
        }
      ]
    });
    this.list.push({
      name: "Levy C Görbe", 
      previewId: "levyc-prev", 
      preview: this.levyC, 
      algorithm: this.levyC,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
        }
      ]
    });
    this.list.push({
      name: "Püthagorasz Fa", 
      previewId: "pythagoras-tree-prev", 
      preview: this.pythTree, 
      algorithm: this.pythTree,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
        }
      ]
    });
    this.list.push({
      name: "Koch Görbe", 
      previewId: "koch-curve-preview", 
      preview: this.kochCurvePreview, 
      algorithm: this.kochCurvePreview,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
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
