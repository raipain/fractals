import {NgModule} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule
    
  ],
  exports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule
  ],
})

export class MaterialModule {
}