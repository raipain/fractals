import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fractalsv1',
  templateUrl: './fractalsv1.component.html',
  styleUrls: ['./fractalsv1.component.scss']
})
export class Fractalsv1Component implements OnInit {

  listStatus: string;

  constructor() {
    this.listStatus = "show";
  }

  ngOnInit() { }

  handleListEvent(event: any) {
    this.listStatus = event;
  }

}
