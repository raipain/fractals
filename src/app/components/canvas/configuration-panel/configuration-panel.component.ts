import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

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

  private configurationPanelHideAnimationStatus: string = "show";
  private fractalList: IFractalList[];
  private selectedFractal: number;
  private color: string = "#000";
  private subColors: string[] = ["#000", "#000", "#000"];

  constructor(private fractalService: FractalsService) { }

  ngOnInit() {
    this.fractalList = this.fractalService.getList();
    this.fractalService.getSelectedFractal().subscribe((index: number) => {
      this.selectedFractal = index
      this.color = "#000";
    });
  }

  toggleConfigurationPanelAnimation(): void {
    if(this.configurationPanelHideAnimationStatus == "show") {
      this.configurationPanelHideAnimationStatus = "hide";
    }
    else {
      this.configurationPanelHideAnimationStatus = "show";
    }
  }

  setValue(func, value): void {
    func(this.fractalList[this.selectedFractal].algorithm, value);
  }

}
