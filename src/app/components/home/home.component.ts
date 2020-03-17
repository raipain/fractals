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

    constructor(private algorithmService: AlgorithmService) { }

    ngOnInit(): void {
        this.algorithmList = this.algorithmService.getList();
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
