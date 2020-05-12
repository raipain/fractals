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
				name: "Sierpiński-háromszög",
				previewId: "sierpinski-triangle-preview",
				preview: this.sierpinskiTrianglePreview,
				algorithm: this.sierpinskiTriangleConfigurable,
				configurations: this.sierpinskiTriangleConfigurable.CONFIGURATIONS,
				about: "A Sierpiński-háromszög Wacław Sierpiński lengyel matematikus által megtalált fraktál, amely úgy áll elő, hogy egy szabályos háromszögből elhagyjuk az oldalfelező pontok összekötésével nyert belső háromszöget, majd az így maradt három háromszögre rekurzívan alkalmazzuk ugyanezt az eljárást. Hasonló eljárással állítható elő egy négyzetből a Sierpiński-szőnyeg. A Sierpiński-háromszög konstrukciójához többnyire egyenlő oldalú háromszöget választanak. Ez azonban nem kötelező, bármely háromszögből lehet Sierpiński-háromszöget készíteni."
			},
			{
				name: "Sierpiński-szőnyeg",
				previewId: "sierpc",
				preview: this.sierpc,
				algorithm: this.sierpinskiCarpetConfigurable,
				configurations: this.sierpinskiCarpetConfigurable.CONFIGURATIONS,
				about: "A Sierpiński-szőnyeg szintén Waclaw Sierpinski lengyel matematikus által megtalált fraktál, amely úgy áll elő, hogy egy négyzetet oldalai harmadolásával kilenc kisebb négyzetre bontunk, a középsőt elhagyjuk, és a maradék nyolcon elvégezzük ugyanezt az eljárást (vagyis azoknak is elhagyjuk a közepét), majd az így maradt 8x8 kisebb négyzeten is, stb. Az eredményül kapott alakzat területe nulla, kerülete végtelen nagy."
			},
			{
				name: "Lévy C-görbe",
				previewId: "levy-c-curve-preview",
				preview: this.levyC,
				algorithm: this.levyCCurveConfigurable,
				configurations: this.levyCCurveConfigurable.CONFIGURATIONS,
				about: "Lévy C-görbe egy önmagára hasonlító fraktál, amit először Ernesto Cesàro írt le, és elemezte a differenciálhatóságát 1906-ban, majd őt 1910-ben Georg Faber követte. Ma azonban a francia matematikus Paul Lévy nevét viseli, aki először írta le az önhasonlóság tulajdonságait. Ez a fraktál alapjáraton nagyon hasonlít a Koch-görbére, egyedüli eltérés, hogy az egyenesekre való háromszögek rajzolásakor nem az egyenes egy bizonyos százaléka adja a háromszög alapját, hanem a teljes egyenes."
			},
			{
				name: "Pitagorasz-fa",
				previewId: "pythagoras-tree-prev",
				preview: this.pythTree,
				algorithm: this.pythagorasTreeConfigurable,
				configurations: this.pythagorasTreeConfigurable.CONFIGURATIONS,
				about: "A Pitagorasz-fa egy négyzetekből előálló fraktál. Holland matematika tanár Albert E. Bosman fedezte fel 1942-ben, nevét az ősi matematikusról, Pitagoraszról kapta, mert minden egymást érintő négyzet hármas, egy szabályos háromszöget zár be. Ha a legnagyobb négyzet L x L méretű, az egész Pitagorasz-fa belefér egy 6L x 4L méretű négyzetbe. A hagyományos, egyenlő szárú Pitagorasz-fa a következőképpen konstruálható: az első iterációban létrejön a törzse, amely egy négyzet. A második iterációban a törzsnek a felső élére egy egyenlő szárú derékszögű háromszög rajzolunk úgy, hogy átfogója a négyzet felső éle, valamint a háromszög két befogójából kiágazik az első két ág, amelyek szintén négyzetek. Ezután minden iterációban ez ismétlődik, azaz minden korábbi négyzet felső élére egy egyenlő szárú derékszögű háromszög nő, és azok befogói új négyzetágakat növesztenek."
			},
			{
				name: "Koch-görbe",
				previewId: "koch-curve-preview",
				preview: this.kochCurvePreview,
				algorithm: this.kochCurveConfigurable,
				configurations: this.kochCurveConfigurable.CONFIGURATIONS,
				about: "A Koch-görbe vagy Koch-hópehely Helge von Koch svéd matematikus által leírt fraktál. A görbét úgy állítjuk elő, hogy veszünk egy szabályos (egyenlő oldalú) háromszöget, minden oldalát megharmadoljuk, és a középső harmadszakaszra újabb szabályos háromszögeket rajzolunk. Majd az így keletkezett háromszögoldalakra újra feltesszük ezt a kinövést, és ezt a műveletet a végtelenségig folytatjuk. A görbe egyre jobban egy hópehelyhez fog hasonlítani. Természetesen az igazi, teljes hópehely lerajzolása lehetetlen, csupán a hozzá vezető állapotok egymásutánját tudjuk ábrázolni. Amint újabb és újabb kinövéseket szerkesztünk a háromszögek oldalaira, a hópehely kerülete egyre nő, azaz a hópehely kerülete valójában végtelen. Mivel maga az alakzat megmarad az első háromszög köré írt körének belsejében, így azt mondhatjuk, hogy a területe viszont véges."
			},
			{
				name: "H-fa",
				previewId: "h-tree-preview",
				preview: this.hTreePreview,
				algorithm: this.hTreeConfigurable,
				configurations: this.hTreeConfigurable.CONFIGURATIONS,
				about: "A H-fa struktúrája hasonló a Fraktál-fáéhoz. Ez a fraktál merőleges vonalak közvetlen egymás mellé helyezésével konstruálható meg. Minden vonal mindkét végpontján egy rá merőleges vonal halad át, amelynek hossza mindig négyzetgyök 2-vel kisebb az előző vonal hosszától. Ez egy alapértelmezett érték, ami a konfigurációs panelben tetszőlegesen állítható. A fraktál a nevét onnan kapta, hogy a benne ismétlődő minta a H betűre emlékeztet."
			},
			{
				name: "Fraktál-fa",
				previewId: "fractal-tree-preview",
				preview: this.fractalTreePreview,
				algorithm: this.fractalTreeConfigurable,
				configurations: this.fractalTreeConfigurable.CONFIGURATIONS,
				about: "A Fraktál-fa egy viszonylag egyszerűen megkonstruálható fraktál, ami a legismertebb fraktálok közé tartozik. Szerkezete nagyon hasonlít a Pitagorasz-fához, annyi különbséggel, hogy négyzetek helyett egyszerű vonalakból tevődik össze. A Fraktál-fa első iterációjában csak a törzs van, a másodikban a törzsből két ág nő ki egy bizonyos szöget bezárva a törzzsel. Ez a szög tetszőlegesen állítható a konfigurációs panelben. A további iterációkban ez ismétlődik, tehát a már meglévő ágakből új ágak nőnek ki, ez a végtelenségig ismételhető."
			},
			{
				name: "Hilbert-görbe",
				previewId: "hilbert-curve-preview",
				preview: this.hilbertCurvePreview,
				algorithm: this.hilbertCurveConfigurable,
				configurations: this.hilbertCurveConfigurable.CONFIGURATIONS,
				about: "A Hilbert-görbe egy térkitöltő görbe. Az első térkitöltő görbét ugyan Peano alkotta meg, de Hilbert volt az első, aki érthető geometriai képet tudott mutatni egy általa definiált térkitöltő görbéről. Megadott egy geometriai generáló eljárást, amivel létrehozta ezen görbék egy osztályát. Egy térkitöltő görbét rekurzívan adhatunk meg, bizonyos lépések végtelen sokszori alkalmazásával. Maga a térkitöltő görbe végtelen hosszú, így példaként is szolgálhat véges területen végtelen hosszú görbe létezésére."
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
