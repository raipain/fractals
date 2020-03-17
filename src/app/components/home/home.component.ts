import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { IAlgorithmList } from 'src/app/models/algorithm-list';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    @Output() canvas: EventEmitter<void> = new EventEmitter<void>();
    private algorithmList: IAlgorithmList[];
    private firstRowAlgorithms: IAlgorithmList[];
    private secondRowAlgorithms: IAlgorithmList[];

    constructor(private algorithmService: AlgorithmService) { }

    ngOnInit(): void {
        this.algorithmList = this.algorithmService.getList();
        this.firstRowAlgorithms = this.algorithmList.slice(0, this.algorithmList.length / 2);
        this.secondRowAlgorithms = this.algorithmList.slice(this.algorithmList.length / 2, this.algorithmList.length);
        this.algorithmList.forEach(algorithm => {
            algorithm.preview.init(algorithm.previewId, 150, 150, "#437a99");
        })
    }

    selectAlgorithm(index: number): void {
        this.algorithmService.selectAlgorithm(index);
        this.canvas.emit();
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.algorithmList.length; i++) {
            this.algorithmList[i].preview.removeCanvas();
        }
    }

}
