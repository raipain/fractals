import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SierpinskiTrianglePreview } from '../algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiCarpetPreview } from '../algorithms/sierpinski-carpet/sierpinski-carpet-prev';
import { IAlgorithmList } from '../models/algorithm-list';
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

export class AlgorithmService {

	public list: IAlgorithmList[];
	public active: BehaviorSubject<number>;
	private activeIndex: number;

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
		this.list = [
			{
				name: "Sierpinszki háromszög",
				previewId: "sierpinski-triangle-preview",
				preview: this.sierpinskiTrianglePreview,
				algorithm: this.sierpinskiTriangleConfigurable,
				configurations: this.sierpinskiTriangleConfigurable.CONFIGURATIONS,
				about: "A Sierpiński-háromszög Wacław Sierpiński lengyel matematikus által megtalált fraktál, amely úgy áll elő, hogy egy szabályos háromszögből elhagyjuk az oldalfelező pontok összekötésével nyert belső háromszöget, majd az így maradt három háromszögre rekurzívan alkalmazzuk ugyanezt az eljárást. Hasonló eljárással állítható elő egy négyzetből a Sierpiński-szőnyeg."
			},
			{
				name: "Sierpinszki szőnyeg",
				previewId: "sierpc",
				preview: this.sierpc,
				algorithm: this.sierpinskiCarpetConfigurable,
				configurations: this.sierpinskiCarpetConfigurable.CONFIGURATIONS,
				about: "A Sierpiński-szőnyeg egy Wacław Sierpiński lengyel matematikus által megtalált fraktál, amely úgy áll elő, hogy egy négyzetet oldalai harmadolásával kilenc kisebb négyzetre bontunk, a középsőt elhagyjuk, és a maradék nyolcon elvégezzük ugyanezt az eljárást (vagyis azoknak is elhagyjuk a közepét), majd az így maradt 8×8 kisebb négyzeten is, stb. Az eredményül kapott alakzat területe nulla, kerülete végtelen nagy."
			},
			{
				name: "Levy C Görbe",
				previewId: "levy-c-curve-preview",
				preview: this.levyC,
				algorithm: this.levyCCurveConfigurable,
				configurations: this.levyCCurveConfigurable.CONFIGURATIONS,
				about: "Lévy C görgbe egy önmagára hasonlító fraktál, amit először Ernesto Cesàro írt le, és elemezte a differenciálhatóságát 1906-ban, majd őt 1910-ben Georg Faber követte. Ma azonban a francia matematikus Paul Lévy nevét viseli, aki először írta le az önhasonlóság tulajdonságait. Ez a fraktál azonos osztályban van a Koch görbével."
			},
			{
				name: "Püthagorasz Fa",
				previewId: "pythagoras-tree-prev",
				preview: this.pythTree,
				algorithm: this.pythagorasTreeConfigurable,
				configurations: this.pythagorasTreeConfigurable.CONFIGURATIONS,
				about: "A Pitagorasz fa egy négyzetekből előálló fraktál. Holland matematika tanár Albert E. Bosman fedezte fel 1942-ben, nevét az ősi matematikusról, Pitagoraszról kapta, mert minden egymást érintő négyzet hármas, egy szabályos háromszöget zár be. Ha a legnagyobb négyzet L x L méretű, az egész Pitagorasz fa belefér egy 6L x 4L méretű négyzetbe."
			},
			{
				name: "Koch Görbe",
				previewId: "koch-curve-preview",
				preview: this.kochCurvePreview,
				algorithm: this.kochCurveConfigurable,
				configurations: this.kochCurveConfigurable.CONFIGURATIONS,
				about: "A Koch-görbe vagy Koch-hópehely Helge von Koch svéd matematikus által 1904-ben leírt fraktál, mely ilyen minőségében az egyik legelső. A görbét úgy állíthatjuk elő, hogy egy szabályos háromszög oldalait elharmadoljuk, majd a középső harmadára ismét egy szabályos háromszöget rajzolunk. Ezen háromszögek oldalait szintén harmadoljuk, és háromszöget rajzolunk rájuk. Ezt a végtelenségig folytatjuk. A határértékként kapott görbe végtelenül finoman strukturált, és csak közelítőleg lehet ábrázolni. Azok a pontok alkotják, amiket egy iterációs lépés után a további iterációs lépések megőriznek, vagy torlódási pontjai ennek a ponthalmaznak. Sokszor ennek az önmagába záródó görbének harmadát hívják Koch-görbének."
			},
			{
				name: "H-fa",
				previewId: "h-tree-preview",
				preview: this.hTreePreview,
				algorithm: this.hTreeConfigurable,
				configurations: this.hTreeConfigurable.CONFIGURATIONS,
				about: "A fraktálok világában, a H-fa egy fraktál fa struktúra, amely merőleges vonalakból áll össze. Minden vonal hosszúsága négyzetgyökkel csökken, a szomszédos nagyobb vonal hosszúságától. A neve onnan ered, hogy az ismétlődő minta a H betűre emlékeztet. A Hausdorff dimenziója 2. VLSI tervezésben, és mikrohullámú technológiában alkalmazzák."
			},
			{
				name: "Fraktál fa",
				previewId: "fractal-tree-preview",
				preview: this.fractalTreePreview,
				algorithm: this.fractalTreeConfigurable,
				configurations: this.fractalTreeConfigurable.CONFIGURATIONS,
				about: "A Fraktál fa az egyik legegyszerűbb fraktál alakzat. Alapjuk az önhasonlóság. Minden ág egy bizonyos mértékkel rövidebb a gyökértől. A szög, hosszúság véletlenszerű is lehet, így realisztikusabb fát kapunk."
			},
			{
				name: "Hilbert görbe",
				previewId: "hilbert-curve-preview",
				preview: this.hilbertCurvePreview,
				algorithm: this.hilbertCurveConfigurable,
				configurations: this.hilbertCurveConfigurable.CONFIGURATIONS,
				about: "A Hilbert görbe egy térkitöltő görbe. Az első térkitöltő görbét ugyan Peano alkotta meg, de Hilbert volt az első, aki érthető geometriai képet tudott mutatni egy általa definiált térkitöltő görbéről. Megadott egy geometriai generáló eljárást, amivel létrehozta ezen görbék egy osztályát. Egy térkitöltő görbét rekurzívan adhatunk meg, bizonyos lépések végtelen sokszori alkalmazásával. Maga a térkitöltő görbe végtelen hosszú, így példaként is szolgálhat véges területen végtelen hosszú görbe létezésére."
			}
		];
		if (localStorage.getItem("index") != null) {
			this.activeIndex = +localStorage.getItem("index");
		}
		this.active = new BehaviorSubject<number>(this.activeIndex);
	}

	public getList(): IAlgorithmList[] {
		return this.list;
	}

	public getSelectedAlgorithm(): Observable<number> {
		return this.active;
	}

	public selectAlgorithm(index: number): void {
		if (this.activeIndex != null) {
			this.list[this.activeIndex].algorithm.removeCanvas();
		}
		this.activeIndex = index;
		localStorage.setItem("index", this.activeIndex + "");
		this.active.next(index);
	}
}
