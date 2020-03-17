import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { IAlgorithmList } from 'src/app/models/algorithm-list';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @Output() canvas: EventEmitter<void> = new EventEmitter<void>();
    private algorithms: IAlgorithmList[];
    private firstRowAlgorithms: IAlgorithmList[];
    private secondRowAlgorithms: IAlgorithmList[];

    constructor(private algorithmService: AlgorithmService) { }

    ngOnInit() {
        this.algorithms = this.algorithmService.getList();
        this.firstRowAlgorithms = this.algorithms.slice(0, this.algorithms.length / 2);
        this.secondRowAlgorithms = this.algorithms.slice(this.algorithms.length / 2, this.algorithms.length);
        this.algorithms.forEach(algorithm => {
            algorithm.preview.init(algorithm.previewId, 150, 150, "#437a99");
        })
    }

    selectAlgorithm(index: number): void {
        this.algorithmService.selectAlgorithm(index);
        this.canvas.emit();
    }

}
