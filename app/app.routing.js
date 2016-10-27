"use strict";
var router_1 = require('@angular/router');
var search_component_1 = require('./components/search/search.component');
var about_component_1 = require('./components/about/about.component');
var collect_component_1 = require('./components/collect/collect.component');
// import {searchgridComponent} from './components/searchgrid/searchgrid.component';
var appRoutes = [
    {
        path: '',
        component: search_component_1.SearchComponent
    },
    {
        path: 'about',
        component: about_component_1.AboutComponent
    },
    {
        path: 'collect',
        component: collect_component_1.CollectComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map