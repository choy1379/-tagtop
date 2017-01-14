"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var ng2_charts_1 = require('ng2-charts/ng2-charts');
var app_component_1 = require('./app.component');
var search_component_1 = require('./components/search/search.component');
var navbar_component_1 = require('./components/navbar/navbar.component');
var about_component_1 = require('./components/about/about.component');
var collect_component_1 = require('./components/collect/collect.component');
var main_1 = require('ag-grid-ng2/main');
var app_routing_1 = require('./app.routing');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule,
                app_routing_1.routing,
                forms_1.FormsModule,
                http_1.HttpModule,
                main_1.AgGridModule.forRoot(),
                forms_1.ReactiveFormsModule,
                ng2_charts_1.ChartsModule
            ],
            declarations: [app_component_1.AppComponent,
                search_component_1.SearchComponent,
                navbar_component_1.NavbarComponent,
                about_component_1.AboutComponent,
                collect_component_1.CollectComponent
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map