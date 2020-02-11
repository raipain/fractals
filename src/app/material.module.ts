import {NgModule} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    ColorPickerModule
  ],
  exports: [
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    ColorPickerModule
  ],
})

export class MaterialModule { }