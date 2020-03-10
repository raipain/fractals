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
import { HTreePreview } from '../algorithms/h-tree/h-tree-preview';
import { HTreeConfigurable } from '../algorithms/h-tree/h-tree-conf';
import { FractalTreePreview } from '../algorithms/fractal-tree/fractal-tree-preview';
import { FractalTreeConfigurable } from '../algorithms/fractal-tree/fractal-tree-conf';
import { HilbertCurvePreview } from '../algorithms/hilbert-curve/hilbert-curve-prev';
import { HilbertCurveConfigurable } from '../algorithms/hilbert-curve/hilbert-curve-conf';

@Injectable({
  providedIn: 'root'
})

export class FractalsService {

  list = new Array<IFractalList>();
  activeFractal = new BehaviorSubject<number>(null);
  activeAlgorithmIndex: number;

  constructor(private sierpinskiTrianglePreview: SierpinskiTrianglePreview,
              private sierpinskiTriangleConfigurable: SierpinskiTriangleConfigurable,
              private sierpc: SierpinskiCarpetPreview,
              private sierpinskiCarpetConfigurable: SierpinskiCarpetConfigurable,
              private levyC: LevyCCurvePreview,
              private levyCCurveConfigurable: LevyCCurveConfigurable,
              private pythTree: PythagorasTreePreview,
              private pythagorasTreeConfigurable: PythagorasTreeConfigurable,
              private fractalTreePreview: FractalTreePreview,
              private fractalTreeConfigurable: FractalTreeConfigurable,
              private kochCurvePreview: KochCurvePreview,
              private kochCurveConfigurable: KochCurveConfigurable,
              private hTreePreview: HTreePreview,
              private hTreeConfigurable: HTreeConfigurable,
              private hilbertCurvePreview: HilbertCurvePreview,
              private hilbertCurveConfigurable: HilbertCurveConfigurable)
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
            func: this.sierpinskiTriangleConfigurable.setFrameRate
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
          func: this.sierpinskiCarpetConfigurable.setFrameRate
        },
        {
          name: "Szín",
          type: "colorpicker",
          func: this.sierpinskiCarpetConfigurable.setColor
        },
        {
          name: "Négyzet mérete",
          type: "slider",
          value: 300,
          minValue: 100,
          maxValue: 600,
          step: 1,
          func: this.sierpinskiCarpetConfigurable.setRectSize
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
          func: this.levyCCurveConfigurable.setFrameRate
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
          name: "Szög",
          type: "slider",
          value: 60,
          minValue: 20,
          maxValue: 80,
          step: 1,
          func: this.levyCCurveConfigurable.setAngle
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
          func: this.pythagorasTreeConfigurable.setFrameRate
        },
        {
          name: "Fixált szög",
          type: "checkbox",
          value: 1,
          func: this.pythagorasTreeConfigurable.setFixedAngle
        },
        {
          name: "Fixált gyökér",
          type: "checkbox",
          value: 1,
          func: this.pythagorasTreeConfigurable.setFixedRoot
        },
        {
          name: "Oldalhosszúság",
          type: "slider",
          value: 1,
          minValue: 10,
          maxValue: 400,
          step: 1,
          func: this.pythagorasTreeConfigurable.setRectSize
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
          func: this.kochCurveConfigurable.setFrameRate
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
        },
        {
          name: "Vonalhosszúság",
          type: "slider",
          value: 200,
          minValue: 1,
          maxValue: 500,
          step: 1,
          func: this.kochCurveConfigurable.setLength
        },
        {
          name: "Szög",
          type: "slider",
          value: 60,
          minValue: 20,
          maxValue: 80,
          step: 1,
          func: this.kochCurveConfigurable.setAngle
        },
        {
          name: "Fixált kezdővonal",
          type: "checkbox",
          value: 1,
          func: this.kochCurveConfigurable.setFixedLine
        },
        {
          name: "Irány",
          type: "combobox",
          values: [
            {
              name: "Fel",
              value: 1
            },
            {
              name: "Le",
              value: -1
            }
          ],
          func: this.kochCurveConfigurable.setDirection
        }
      ]
    });
    this.list.push({
      name: "H-fa",
      previewId: "h-tree-preview",
      preview: this.hTreePreview,
      algorithm: this.hTreeConfigurable,
      configurations: [
        {
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 200,
          step: 1,
          func: this.hTreeConfigurable.setFrameRate
        },
        {
          name: "Vonalvastagság",
          type: "slider",
          value: 3,
          minValue: 1,
          maxValue: 10,
          step: 1,
          func: this.hTreeConfigurable.setStrokeWeight
        },
        {
          name: "Vonalhosszúság",
          type: "slider",
          value: 200,
          minValue: 50,
          maxValue: 500,
          step: 1,
          func: this.hTreeConfigurable.setLength
        },
        {
          name: "Fixált kezdővonal",
          type: "checkbox",
          value: 1,
          func: this.hTreeConfigurable.setCustomRoot
        },
        {
          name: "Szín",
          type: "colorpicker",
          func: this.sierpinskiTriangleConfigurable.setColor
        }
      ]
    });

    this.list.push({
      name: "Fraktál fa",
      previewId: "fractal-tree-preview",
      preview: this.fractalTreePreview,
      algorithm: this.fractalTreeConfigurable,
      configurations: [
        {
          name: "Gyorsaság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 200,
          step: 1,
          func: this.fractalTreeConfigurable.setFrameRate
        },
        {
          name: "Vonalvastagság",
          type: "slider",
          value: 3,
          minValue: 1,
          maxValue: 10,
          step: 1,
          func: this.fractalTreeConfigurable.setStrokeWeight
        },
        {
          name: "Vonalhosszúság",
          type: "slider",
          value: 200,
          minValue: 50,
          maxValue: 500,
          step: 1,
          func: this.fractalTreeConfigurable.setLength
        },
        {
          name: "Ágak száma",
          type: "slider",
          value: 2,
          minValue: 2,
          maxValue: 3,
          step: 1,
          func: this.fractalTreeConfigurable.setBranches
        },
        {
          name: "Elforgatási szög",
          type: "slider",
          value: 45,
          minValue: 0,
          maxValue: 90,
          step: 1,
          func: this.fractalTreeConfigurable.setAngle
        },
        {
          name: "Ág mérete (%)",
          type: "slider",
          value: 80,
          minValue: 0,
          maxValue: 100,
          step: 1,
          func: this.fractalTreeConfigurable.setLerpPercentage
        },
        {
          name: "Fixált kezdővonal",
          type: "checkbox",
          value: 1,
          func: this.fractalTreeConfigurable.setUseFixedRoot
        },
        {
          name: "Szín",
          type: "colorpicker",
          func: this.fractalTreeConfigurable.setColor
        }
      ]
    });

    this.list.push({
      name: "Hilbert görbe",
      previewId: "hilbert-curve-preview",
      preview: this.hilbertCurvePreview,
      algorithm: this.hilbertCurveConfigurable,
      configurations: [
        {
          name: "Gyorsaság",
          type: "slider",
          value: 20,
          minValue: 1,
          maxValue: 60,
          step: 1,
          func: this.hilbertCurveConfigurable.setFrameRate
        },
        {
          name: "Vonalvastagság",
          type: "slider",
          value: 1,
          minValue: 1,
          maxValue: 10,
          step: 1,
          func: this.hilbertCurveConfigurable.setStrokeWeight
        },
        {
          name: "Iteráció",
          type: "slider",
          value: 5,
          minValue: 1,
          maxValue: 20,
          step: 1,
          func: this.hilbertCurveConfigurable.setOrder
        },
        {
          name: "Szín",
          type: "colorpicker",
          func: this.fractalTreeConfigurable.setColor
        }
      ]
    });
  }

  public getList(): IFractalList[] {
    return this.list;
  }

  public getSelectedFractal(): Observable<number> {
    return this.activeFractal;
  }

  public selectFractal(index: number): void {
    if(this.activeAlgorithmIndex != null) {
      this.list[this.activeAlgorithmIndex].algorithm.removeCanvas();
    }
    this.activeAlgorithmIndex = index;
    localStorage.setItem("index", this.activeAlgorithmIndex + "");
    this.activeFractal.next(index);
  }
}
