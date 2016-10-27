import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SearchComponent} from './components/search/search.component';
import {AboutComponent} from './components/about/about.component';
import {CollectComponent} from './components/collect/collect.component';
// import {searchgridComponent} from './components/searchgrid/searchgrid.component';
const appRoutes: Routes = [
    {
        path:'',
        component:SearchComponent
    },
    {
        path:'about',
        component:AboutComponent
    },
    {
        path:'collect',
        component:CollectComponent
    }
    //  {
    //     path:'collect',
    //     component:searchgridComponent
    // }


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);