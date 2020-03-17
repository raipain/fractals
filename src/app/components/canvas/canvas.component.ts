import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IAlgorithmList } from 'src/app/models/algorithm-list';
import { Subscription } from 'rxjs';
import { AboutComponent } from '../about/about.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-canvas',
	templateUrl: './canvas.component.html',
	styleUrls: ['./canvas.component.scss'],
	host: {'(window:resize)': 'onResize($event)'}
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('canvas', { read: ElementRef, static: false }) container: ElementRef;
	@Output() home: EventEmitter<void> = new EventEmitter<void>();

	private activeAlgorithmSubscription: Subscription;
	private animationStateSubscription: Subscription
	private rollBackSubscription: Subscription;
	private canvasWidth: number;
	private canvasHeight: number;
	private algorithmList: IAlgorithmList[];
	private activeAlgorithm: number;
	private title: string;
	private sliderLength: number;
	private animationState: boolean;

	constructor(private algorithmService: AlgorithmService,
		private animationStateManagerService: AnimationStateManagerService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		this.animationState = false;
		this.sliderLength = 0;
		this.algorithmList = this.algorithmService.getList();
		this.canvasHeight = window.innerHeight * 0.7;
		this.canvasWidth = window.innerWidth * 0.75;
	}

	ngOnDestroy(): void {
		this.activeAlgorithmSubscription.unsubscribe();
		this.animationStateSubscription.unsubscribe();
		this.rollBackSubscription.unsubscribe();
	}

	ngAfterViewInit(): void {
		this.activeAlgorithmSubscription = this.algorithmService.getSelectedAlgorithm().subscribe((index: number) => {
			this.activeAlgorithm = index;
			this.title = this.algorithmList[this.activeAlgorithm].name;
			this.algorithmList[this.activeAlgorithm].algorithm.init("canvas", this.canvasWidth, this.canvasHeight, "#f3f3f3");
			this.rollBackSubscription = this.algorithmList[this.activeAlgorithm].algorithm.getObservable().subscribe(ret => {
				this.sliderLength = ret.length;
			});
		});
		this.animationStateSubscription = this.animationStateManagerService.getState().subscribe((state: boolean) => { this.animationState = state });
		this.cdr.detectChanges();
	}

	onResize(event) {
		this.canvasHeight = window.innerHeight * 0.7;
		this.canvasWidth = window.innerWidth * 0.75;
		this.algorithmList[this.activeAlgorithm].algorithm.removeCanvas();
		this.algorithmList[this.activeAlgorithm].algorithm.init("canvas", this.canvasWidth, this.canvasHeight, "#f3f3f3");
	}

	togglePlay(): void {
		this.animationStateManagerService.setState(!this.animationState);
		this.algorithmList[this.activeAlgorithm].algorithm.togglePlay();
	}

	stop(): void {
		this.animationStateManagerService.setState(false);
		this.algorithmList[this.activeAlgorithm].algorithm.setStop();
	}

	save(): void {
		this.algorithmList[this.activeAlgorithm].algorithm.saveCanvas();
	}

	rollBack(value: number): void {
		this.animationStateManagerService.setState(false);
		this.algorithmList[this.activeAlgorithm].algorithm.setUpRollBack(value);
	}

	about(): void {
		let dialogRef = this.dialog.open(AboutComponent, {
			height: '400px',
			width: '800px',
			data: {
				title: this.title,
				about: this.algorithmList[this.activeAlgorithm].about
			}
		});
	}

	homepage(): void {
		this.algorithmList[this.activeAlgorithm].algorithm.removeCanvas();
		this.home.emit();
	}

}
