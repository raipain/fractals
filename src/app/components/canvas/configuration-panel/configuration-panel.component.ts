import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { IAlgorithmList } from 'src/app/models/algorithm-list';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-configuration-panel',
    templateUrl: './configuration-panel.component.html',
    styleUrls: ['./configuration-panel.component.scss'],
    animations: [
        trigger('configurationPanelHideAnimation', [
            state('hide', style({ transform: "translateX(95%)" })),
            state('show', style({ transform: "translateX(0)" })),
            transition('show <=> hide', animate('275ms ease-in-out'))
        ])
    ]
})
export class ConfigurationPanelComponent implements OnInit {

    public activeAlgorithmSubscription: Subscription;
    public activeAlgorithm: number;
    public algorithmList: IAlgorithmList[];
    public configurationPanelHideAnimationStatus: string;
    public color: string;
    public subColors: string[];

    constructor(private algorithmService: AlgorithmService) {
        this.configurationPanelHideAnimationStatus = "hide";
        this.color = "#000";
        this.subColors = ["#000", "#000", "#000"];
    }

    ngOnInit(): void {
        this.algorithmList = this.algorithmService.getList();
        this.activeAlgorithmSubscription = this.algorithmService.getSelectedAlgorithm().subscribe((index: number) => {
            this.activeAlgorithm = index;
            this.color = "#000";
        });
    }

    ngOnDestroy(): void {
        this.activeAlgorithmSubscription.unsubscribe();
    }

    toggleConfigurationPanelAnimation(): void {
        if (this.configurationPanelHideAnimationStatus == "show") {
            this.configurationPanelHideAnimationStatus = "hide";
        }
        else {
            this.configurationPanelHideAnimationStatus = "show";
        }
    }

    setValue(func, value): void {
        func(this.algorithmList[this.activeAlgorithm].algorithm, value);
    }
}
