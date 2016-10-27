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
var CollectComponent = (function () {
    function CollectComponent(http) {
        this.http = http;
        this.ngcount = 0;
        this.gridOptions = {};
        this.gridOptions.columnDefs = this.createColumnDefs();
    }
    CollectComponent.prototype.onRowClicked = function (event) {
        this.searchdata = event.data;
        this.changeState('searchResult');
        //  this._searchgrid.callback(this.searchdata
    };
    CollectComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.collect = [];
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('http://localhost:4100/dbsearch', { headers: headers }).subscribe(function (res) {
            _this.collect = res.json();
            _this.gridOptions.api.setRowData(res.json());
        });
    };
    CollectComponent.prototype.changeState = function (state, key) {
        console.log('Changing state to: ' + state);
        if (key) {
            console.log('Changing key to: ' + key);
            this.activeKey = key;
        }
        this.appState = state;
    };
    CollectComponent.prototype.addinfo = function (email, name, hashtag, frcal, tocal, twitter) {
        var addinfo = {
            email: email,
            name: name,
            hashtag: hashtag,
            frcal: frcal,
            tocal: tocal,
            twitter: twitter
        };
        console.log(addinfo);
        // ajax로 send 해봄 
        $.ajax({
            type: 'POST',
            data: addinfo,
            contentType: 'application/X-www-form-urlencoded',
            url: 'http://localhost:4100/dbinsert'
        });
        this.changeState('default');
    };
    CollectComponent.prototype.inputcal = function () {
        $('#frcal').datepicker({
            dateFormat: "yy-mm-dd",
            dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
            dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'],
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        });
        $('#tocal').datepicker({
            dateFormat: "yy-mm-dd",
            dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
            dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'],
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        });
    };
    CollectComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "ID", field: "_id", sortingOrder: ["asc", "desc"], editable: false, width: 100 },
            { headerName: "Name", field: "name", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "hashtag", field: "hashtag", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "tocal", field: "tocal", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "소셜미디어", field: "twitter", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        ];
    };
    CollectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'collect',
            templateUrl: 'collect.component.html',
            styleUrls: ['collect.component.css'],
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CollectComponent);
    return CollectComponent;
}());
exports.CollectComponent = CollectComponent;
//# sourceMappingURL=collect.component.js.map