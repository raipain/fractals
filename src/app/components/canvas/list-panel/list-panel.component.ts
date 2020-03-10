import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

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
export class ListPanelComponent implements OnInit {

  listPanelHideAnimationStatus: string = "hide";
  fractalList: IFractalList[];
  selectedFractal: number;
  
  constructor(private fractalService: FractalsService) {
    if(localStorage.getItem("index") != null) {
      this.selectedFractal = +localStorage.getItem("index");
    }
  }

  ngOnInit() {
    this.fractalList = this.fractalService.getList();
    for(let i = 0; i < this.fractalList.length; i++) {
      this.fractalList[i].preview.init(this.fractalList[i].previewId, 150, 150, "#cbcbcb", 700);
    }
  }

  selectFractal(index: number) {
    this.selectedFractal = index;
    this.fractalService.selectFractal(index);
    this.listPanelHideAnimationStatus = "hide";
  }

  toggleListPanelAnimation() {
    if(this.listPanelHideAnimationStatus == "show") {
      this.listPanelHideAnimationStatus = "hide";
    }
    else {
      this.listPanelHideAnimationStatus = "show";
    }
  }

}
