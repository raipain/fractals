import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';

import { HomeComponent } from './components/home/home.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ListPanelComponent } from './components/canvas/list-panel/list-panel.component';
import { ConfigurationPanelComponent } from './components/canvas/configuration-panel/configuration-panel.component';

import { SierpinskiTrianglePreview } from './algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiTriangleConfigurable } from './algorithms/sierpinski-triangle/sierpinski-triangle-conf';
import { SierpinskiCarpetPreview } from './algorithms/sierpinski-carpet/sierpinski-carpet-prev';
import { SierpinskiCarpetConfigurable } from './algorithms/sierpinski-carpet/sierpinski-carpet-conf';
import { LevyCCurvePreview } from './algorithms/levy-c-curve/levy-c-curve-preview';
import { LevyCCurveConfigurable } from './algorithms/levy-c-curve/levy-c-curve-conf';
import { PythagorasTreePreview } from './algorithms/pythagoras-tree/pythagoras-tree-preview';
import { PythagorasTreeConfigurable } from './algorithms/pythagoras-tree/pythagoras-tree-conf';
import { KochCurvePreview } from './algorithms/koch-curve/koch-curve-preview';
import { KochCurveConfigurable } from './algorithms/koch-curve/koch-curve-conf';
import { HTreePreview } from './algorithms/h-tree/h-tree-preview';
import { HTreeConfigurable } from './algorithms/h-tree/h-tree-conf';
import { FractalTreePreview } from './algorithms/fractal-tree/fractal-tree-preview';
import { FractalTreeConfigurable } from './algorithms/fractal-tree/fractal-tree-conf';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ListPanelComponent,
    ConfigurationPanelComponent,
    HomeComponent
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
    LevyCCurveConfigurable,
    SierpinskiCarpetConfigurable, 
    LevyCCurvePreview, 
    PythagorasTreePreview,
    PythagorasTreeConfigurable,
    KochCurvePreview,
    KochCurveConfigurable,
    HTreePreview,
    HTreeConfigurable,
    FractalTreePreview,
    FractalTreeConfigurable
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
