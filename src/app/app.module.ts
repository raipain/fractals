import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StarterPageComponent } from './components/starter-page/starter-page.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PresentationComponent } from './components/presentation/presentation.component';
import { SliderComponent } from './components/presentation/slider/slider.component';
import { IntroComponent } from './components/presentation/slides/intro/intro.component';
import { SlidesComponent } from './components/presentation/slides/slides.component';
import { UsageComponent } from './components/presentation/slides/usage/usage.component';
import { FractalsComponent } from './components/fractals/fractals.component';
import { SierpinskiTriangleComponent } from './components/fractals/sierpinski-triangle/sierpinski-triangle.component';

import { MaterialModule } from './material.module';
import { SierpinskiTriangleDialogComponent } from './components/fractals/sierpinski-triangle/sierpinski-triangle-dialog/sierpinski-triangle-dialog.component';
import { SierpinskiCarpetComponent } from './components/fractals/sierpinski-carpet/sierpinski-carpet.component';
import { SierpinskiCarpetDialogComponent } from './components/fractals/sierpinski-carpet/sierpinski-carpet-dialog/sierpinski-carpet-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StarterPageComponent,
    PresentationComponent,
    SliderComponent,
    IntroComponent,
    SlidesComponent,
    UsageComponent,
    FractalsComponent,
    SierpinskiTriangleComponent,
    SierpinskiTriangleDialogComponent,
    SierpinskiCarpetComponent,
    SierpinskiCarpetDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SierpinskiTriangleDialogComponent]
})
export class AppModule { }
