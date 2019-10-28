import {NgModule} from '@angular/core';

import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule
    
  ],
  exports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule
  ],
})

export class MaterialModule {
}