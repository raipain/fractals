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
		private hilbertCurveConfigurable: HilbertCurveConfigurable) {
		this.list.push(
			{
				name: "Sierpinszki háromszög",
				previewId: "sierpinski-triangle-preview",
				preview: this.sierpinskiTrianglePreview,
				algorithm: this.sierpinskiTriangleConfigurable,
				configurations: this.sierpinskiTriangleConfigurable.CONFIGURATIONS
			},
			{
				name: "Sierpinszki szőnyeg",
				previewId: "sierpc",
				preview: this.sierpc,
				algorithm: this.sierpinskiCarpetConfigurable,
				configurations: this.sierpinskiCarpetConfigurable.CONFIGURATIONS
			},
			{
				name: "Levy C Görbe",
				previewId: "levy-c-curve-preview",
				preview: this.levyC,
				algorithm: this.levyCCurveConfigurable,
				configurations: this.levyCCurveConfigurable.CONFIGURATIONS
			},
			{
				name: "Püthagorasz Fa",
				previewId: "pythagoras-tree-prev",
				preview: this.pythTree,
				algorithm: this.pythagorasTreeConfigurable,
				configurations: this.pythagorasTreeConfigurable.CONFIGURATIONS
			},
			{
				name: "Koch Görbe",
				previewId: "koch-curve-preview",
				preview: this.kochCurvePreview,
				algorithm: this.kochCurveConfigurable,
				configurations: this.kochCurveConfigurable.CONFIGURATIONS
			},
			{
				name: "H-fa",
				previewId: "h-tree-preview",
				preview: this.hTreePreview,
				algorithm: this.hTreeConfigurable,
				configurations: this.hTreeConfigurable.CONFIGURATIONS
			},
			{
				name: "Fraktál fa",
				previewId: "fractal-tree-preview",
				preview: this.fractalTreePreview,
				algorithm: this.fractalTreeConfigurable,
				configurations: this.fractalTreeConfigurable.CONFIGURATIONS
			},
			{
				name: "Hilbert görbe",
				previewId: "hilbert-curve-preview",
				preview: this.hilbertCurvePreview,
				algorithm: this.hilbertCurveConfigurable,
				configurations: this.hilbertCurveConfigurable.CONFIGURATIONS
			});
	}

	public getList(): IFractalList[] {
		return this.list;
	}

	public getSelectedFractal(): Observable<number> {
		return this.activeFractal;
	}

	public selectFractal(index: number): void {
		if (this.activeAlgorithmIndex != null) {
			this.list[this.activeAlgorithmIndex].algorithm.removeCanvas();
		}
		this.activeAlgorithmIndex = index;
		localStorage.setItem("index", this.activeAlgorithmIndex + "");
		this.activeFractal.next(index);
	}
}
