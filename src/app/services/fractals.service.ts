import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SierpinskiTrianglePreview } from '../algorithms/sierpinski-triangle-prev';
import { SierpinskiCarpetPreview } from '../algorithms/sierpinski-carpet-prev';
import { IFractalList } from '../models/fractal-list';
import { SierpinskiCarpetConf } from '../algorithms/sierpinski-carpet-conf';
import { SierpinskiTriangleConf } from '../algorithms/sierpinski-triangle-conf';
import { LevyCCurvePreview } from '../algorithms/levy-c-curve/levy-c-curve-preview';
import { PythagorasTreePreview } from '../algorithms/pythagoras-tree/pythagoras-tree-preview';
import { KochCurvePreview } from '../algorithms/koch-curve/koch-curve-preview';

@Injectable({
  providedIn: 'root'
})

export class FractalsService {

  list = new Array<IFractalList>();
  activeFractal = new BehaviorSubject<number>(null);

  constructor(private sierpt: SierpinskiTrianglePreview, private sierptC: SierpinskiTriangleConf, private sierpc: SierpinskiCarpetPreview, private sierpcC: SierpinskiCarpetConf, private levyC: LevyCCurvePreview, private pythTree: PythagorasTreePreview, private kochCurvePreview: KochCurvePreview) {
    this.list.push({
      name: "Sierpinszki háromszög", 
      previewId: "sierpt", 
      preview: this.sierpt, 
      algorithm: this.sierptC,
      configurations: [
        { 
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
        },
        { 
          name: "Fixált csúcspontok",
          type: "checkbox",
          value: 1
        },
        { 
          name: "Fixált kezdőpont",
          type: "checkbox",
          value: 1
        },
        { 
          name: "Háromszög részeinek kijelölése",
          type: "checkbox",
          value: 1
        },
        { 
          name: "Szín",
          type: "slider",
          value: 1,
          minValue: 0.1,
          maxValue: 1,
          step: 0.1
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
