import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import { AppComponent }  from './app.component';

import {SearchComponent} from './components/search/search.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AboutComponent} from './components/about/about.component';
import {CollectComponent} from './components/collect/collect.component';
import {searchgridComponent} from './components/searchgrid/searchgrid.component';
import {AgGridModule} from 'ag-grid-ng2/main';

import {routing} from './app.routing';


@NgModule({
  imports: [ BrowserModule, 
              routing, 
              FormsModule, 
              HttpModule,
              AgGridModule.withNg2ComponentSupport()
    ],
  declarations: [ AppComponent,
                  SearchComponent,
                  NavbarComponent,
                  AboutComponent,
                  CollectComponent,
                  searchgridComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
