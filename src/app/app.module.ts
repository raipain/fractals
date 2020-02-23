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

import { MaterialModule } from './material.module';
import { SierpinskiTrianglePreview } from './algorithms/sierpinski-triangle/sierpinski-triangle-preview';
import { SierpinskiCarpetPreview } from './algorithms/sierpinski-carpet-prev';
import { SierpinskiCarpetConf } from './algorithms/sierpinski-carpet-conf';
import { SierpinskiTriangleConfigurable } from './algorithms/sierpinski-triangle/sierpinski-triangle-conf';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ListPanelComponent } from './components/canvas/list-panel/list-panel.component';
import { ConfigurationPanelComponent } from './components/canvas/configuration-panel/configuration-panel.component';
import { LevyCCurvePreview } from './algorithms/levy-c-curve/levy-c-curve-preview';
import { PythagorasTreePreview } from './algorithms/pythagoras-tree/pythagoras-tree-preview';
import { KochCurvePreview } from './algorithms/koch-curve/koch-curve-preview';
import { LevyCCurveConfigurable } from './algorithms/levy-c-curve/levy-c-curve-conf';

@NgModule({
  declarations: [
    AppComponent,
    StarterPageComponent,
    PresentationComponent,
    SliderComponent,
    IntroComponent,
    SlidesComponent,
    UsageComponent,
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
    LevyCCurveConfigurable,
    SierpinskiCarpetConf, 
    LevyCCurvePreview, 
    PythagorasTreePreview,
    KochCurvePreview
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
