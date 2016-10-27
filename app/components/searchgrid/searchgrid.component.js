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
var http_1 = require('@angular/http');
var collect_component_1 = require('../collect/collect.component');
var searchgridComponent = (function () {
    function searchgridComponent(http, _CollectComponent) {
        this.http = http;
        this._CollectComponent = _CollectComponent;
        this.gridOptions = {};
        this.gridOptions.columnDefs = this.createColumnDefs();
    }
    searchgridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.receiveData = this._CollectComponent.searchdata;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        this.http.post('http://localhost:4100/searchid', this.receiveData.name, { headers: headers }).subscribe(function (res) {
            console.log(res.json());
            _this.resultData = res.json();
            _this.gridOptions.api.setRowData(_this.resultData);
        });
    };
    searchgridComponent.prototype.callback = function () {
    };
    searchgridComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "ID", field: "_id", sortingOrder: ["asc", "desc"], editable: false, width: 100 },
            { headerName: "Name", field: "name", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "hashtag", field: "hashtag", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "tocal", field: "tocal", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "소셜미디어", field: "twitter", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        ];
    };
    searchgridComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ag-search-grid-component',
            templateUrl: 'searchgrid.component.html'
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, collect_component_1.CollectComponent])
    ], searchgridComponent);
    return searchgridComponent;
}());
exports.searchgridComponent = searchgridComponent;
//# sourceMappingURL=searchgrid.component.js.map