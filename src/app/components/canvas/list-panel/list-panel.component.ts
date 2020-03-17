import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { IAlgorithmList } from 'src/app/models/algorithm-list';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-list-panel',
    templateUrl: './list-panel.component.html',
    styleUrls: ['./list-panel.component.scss'],
    animations: [
        trigger('listPanelHideAnimation', [
            state('hide', style({ transform: "translateX(-90%)" })),
            state('show', style({ transform: "translateX(0)" })),
            transition('show <=> hide', animate('275ms ease-in-out'))
        ]),
        trigger('arrowHideAnimation', [
            state('hide', style({ left: 0 })),
            state('show', style({ left: "175px" })),
            transition('show <=> hide', animate('275ms ease-in-out'))
        ])
    ]
})
export class ListPanelComponent implements OnInit, AfterViewInit, OnDestroy {

    activeAlgorithmSubscription: Subscription;
    activeAlgorithm: number;
    listPanelHideAnimationStatus: string;
    algorithmList: IAlgorithmList[];

    constructor(private algorithmService: AlgorithmService) {
        this.listPanelHideAnimationStatus = "hide";
    }

    ngOnInit(): void {
        this.activeAlgorithmSubscription = this.algorithmService.getSelectedAlgorithm().subscribe((index: number) => { this.activeAlgorithm = index});
        this.algorithmList = this.algorithmService.getList();
    }

    ngAfterViewInit(): void {
        for (let i = 0; i < this.algorithmList.length; i++) {
            this.algorithmList[i].preview.init(this.algorithmList[i].previewId, 150, 150, "#cbcbcb");
        }
    }

    ngOnDestroy(): void {
        this.activeAlgorithmSubscription.unsubscribe();
    }

    selectAlgorithm(index: number): void {
        this.activeAlgorithm = index;
        this.algorithmService.selectAlgorithm(index);
        this.listPanelHideAnimationStatus = "hide";
    }

    toggleListPanelAnimation(): void {
        if (this.listPanelHideAnimationStatus == "show") {
            this.listPanelHideAnimationStatus = "hide";
        }
        else {
            this.listPanelHideAnimationStatus = "show";
        }
    }
}
