import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './components/intro/intro.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { Intro01Component } from './components/intro01/intro01.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    Intro01Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
