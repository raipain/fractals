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
import { Fractalsv1Component } from './components/fractalsv1/fractalsv1.component';
import { ListComponent } from './components/fractalsv1/list/list.component';
import { SierpinskiTrianglePreview } from './algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiCarpetPreview } from './algorithms/sierpinski-carpet-prev';
import { ConfComponent } from './components/fractalsv1/conf/conf.component';
import { DrawingComponent } from './components/fractalsv1/drawing/drawing.component';
import { SierpinskiCarpetConf } from './algorithms/sierpinski-carpet-conf';
import { SierpinskiTriangleConfigurable } from './algorithms/sierpinski-triangle/sierpinski-triangle-conf';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ListPanelComponent } from './components/canvas/list-panel/list-panel.component';
import { ConfigurationPanelComponent } from './components/canvas/configuration-panel/configuration-panel.component';
import { LevyCCurvePreview } from './algorithms/levy-c-curve/levy-c-curve-preview';
import { PythagorasTreePreview } from './algorithms/pythagoras-tree/pythagoras-tree-preview';
import { KochCurvePreview } from './algorithms/koch-curve/koch-curve-preview';

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
    SierpinskiCarpetDialogComponent,
    Fractalsv1Component,
    ListComponent,
    ConfComponent,
    DrawingComponent,
    CanvasComponent,
    ListPanelComponent,
    ConfigurationPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [
    SierpinskiTrianglePreview, 
    SierpinskiCarpetPreview, 
    SierpinskiTriangleConfigurable, 
    SierpinskiCarpetConf, 
    LevyCCurvePreview, 
    PythagorasTreePreview,
    KochCurvePreview
  ],
  bootstrap: [AppComponent],
  entryComponents: [SierpinskiTriangleDialogComponent]
})
export class AppModule { }
