import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {ChartsModule} from 'ng2-charts/ng2-charts';


import { AppComponent }  from './app.component';

import {SearchComponent} from './components/search/search.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AboutComponent} from './components/about/about.component';
import {CollectComponent} from './components/collect/collect.component';

import {AgGridModule} from 'ag-grid-ng2/main';

import {routing} from './app.routing';


@NgModule({
  imports: [ BrowserModule, 
              routing, 
              FormsModule, 
              HttpModule,
              AgGridModule,
              ReactiveFormsModule,
              ChartsModule

    ],
  declarations: [ AppComponent,
                  SearchComponent,
                  NavbarComponent,
                  AboutComponent,
                  CollectComponent
                  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
