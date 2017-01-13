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
var forms_1 = require('@angular/forms');
var CollectComponent = (function () {
    function CollectComponent(http, fb) {
        this.http = http;
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
        };
        //하단 라벨
        this.barChartLabels = [''];
        //바 타입
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
        ];
        this.SumArrayData = new Array(new Array(0));
        this.ngcount = 0;
        this.since_id = "0";
        this.max_id = "0";
        //그리드 옵션 정리
        this.gridOptions = {};
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions2 = {};
        this.gridOptions2.columnDefs = this.createColumnDefs2();
        //validate check
        this.VailidateForm = fb.group({
            'email': [null, forms_1.Validators.required],
            'id': [null, forms_1.Validators.required],
            'hashtag': [null, forms_1.Validators.required],
            'date': [null, forms_1.Validators.required]
        });
        console.log(this.VailidateForm);
        this.VailidateForm.valueChanges.subscribe(function (form) {
            // console.log('form changed to:', form);
        });
    }
    CollectComponent.prototype.overimage = function (event) {
        if (event.fromElement.innerText.slice(0, 8) == 'https://') {
            var divTop = event.clientY - 20 + 'px'; //상단 좌표
            var divLeft = event.clientX + 10 + 'px'; //좌측 좌표
            document.getElementById("imgViewer").setAttribute('src', event.fromElement.innerText);
            document.getElementById("imgViewer").setAttribute('style', 'z-index:1; position: absolute; top :' + divTop + ';left : ' + divLeft + ';width: 150px; display:block;');
            console.log(event);
        }
    };
    CollectComponent.prototype.overimagemove = function (event) {
        var divTop = event.clientY - 20 + 'px'; //상단 좌표
        var divLeft = event.clientX + 10 + 'px'; //좌측 좌표
        document.getElementById("imgViewer").setAttribute('style', 'z-index :1; position: absolute; top :' + divTop + ';left : ' + divLeft + ';width: 150px; display:block;');
    };
    CollectComponent.prototype.overimageout = function (event) {
        document.getElementById("imgViewer").setAttribute('style', 'display:none;');
    };
    CollectComponent.prototype.onRowClicked = function (event) {
        var _this = this;
        this.searchdata = event.data;
        var query = {
            "name": this.searchdata.name,
            "searchquery": this.searchdata.hashtag
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('http://localhost:4100/searchid', query, { headers: headers }).subscribe(function (res) {
            _this.resultData = res.json();
            //2017-01-10 그래프 부분 
            var TempResultData = new Array(); //수집된데이타 날짜    배열
            var overlapData = new Array(); // 날짜 월 일만 짜른 배열
            var overlapcount = new Array(); // 중복된값 카운트   배열
            for (var i = 0; i < _this.resultData.length - 1; i++) {
                TempResultData[i] = _this.resultData[i]['date'].substring(0, 10);
            }
            TempResultData.sort(_this.sortDate);
            for (var i = 0; i < TempResultData.length; i++) {
                TempResultData[i] = TempResultData[i].substring(5, 10);
            }
            //array 중복 제거 
            var uniq = TempResultData.reduce(function (a, b) {
                if (a.indexOf(b) < 0)
                    a.push(b);
                return a;
            }, []);
            _this.barChartLabels = uniq;
            for (var value in TempResultData) {
                var index = TempResultData[value];
                overlapData[index] = overlapData[index] == undefined ? 1 : overlapData[index] += 1;
            }
            for (var i = 0; i < uniq.length; i++) {
                var tempname = uniq[i];
                overlapcount[i] = overlapData[tempname];
            }
            _this.barChartData = [{ data: overlapcount, label: _this.resultData[0]['searchquery'] }];
            _this.gridOptions2.api.setRowData(_this.resultData);
            var resultsearch_show = document.getElementById("resultsearch").style.display = 'inline';
        });
    };
    CollectComponent.prototype.sortDate = function (a, b) {
        var arr0 = a.split("-");
        var arr1 = b.split("-");
        var date_a = new Date(arr0[0], arr0[1] - 1, arr0[2]);
        var date_b = new Date(arr1[0], arr1[1] - 1, arr1[2]);
        if (date_a < date_b)
            return -1;
        if (date_a > date_b)
            return 1;
        return 0;
    };
    CollectComponent.prototype.chartClicked = function (e) {
        // console.log(e);
    };
    CollectComponent.prototype.chartHovered = function (e) {
        // console.log(e);
    };
    CollectComponent.prototype.ngOnInit = function () {
        var _this = this;
        //테스트위해 잠심 11/02
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        this.http.post('http://localhost:4100/authorize', { headers: headers }).subscribe(function (res) {
            console.log(res);
        });
        console.log("권한 활성화");
        this.collect = [];
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('http://localhost:4100/dbsearch', { headers: headers }).subscribe(function (res) {
            _this.collect = res.json();
            _this.gridOptions.api.setRowData(res.json());
            var resultsearch_hide = document.getElementById("resultsearch").style.display = 'none';
        });
    };
    CollectComponent.prototype.changeState = function (state, key) {
        console.log('Changing state to: ' + state);
        if (key) {
            console.log('Changing key to: ' + key);
            this.activeKey = key;
        }
        this.appState = state;
        //temp validate check
    };
    CollectComponent.prototype.Exportcsv = function () {
        this.gridOptions2.api.exportDataAsCsv('asd');
    };
    CollectComponent.prototype.addinfo = function (email, name, hashtag, frcal, tocal, twitter) {
        var _this = this;
        var addinfo = {
            email: email,
            name: name,
            hashtag: hashtag,
            frcal: frcal,
            tocal: tocal,
            twitter: twitter
        };
        var query = {
            "hashtag": hashtag,
            "email": email,
            "frcal": frcal,
            "tocal": tocal,
            "twitter": twitter,
            "name": name
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('http://localhost:4100/dbUserinsert', query, { headers: headers }).subscribe(function (res) {
            _this.gridOptions.api.refreshView();
            _this.collect = [];
            var headers = new http_1.Headers();
            headers.append('Content-Type', 'application/json');
            _this.http.post('http://localhost:4100/dbsearch', { headers: headers }).subscribe(function (res) {
                _this.collect = res.json();
                _this.gridOptions.api.setRowData(res.json());
                var resultsearch_hide = document.getElementById("resultsearch").style.display = 'none';
            });
        });
        // $.ajax({
        //         type: 'POST',
        //             data: {
        //                       "hashtag" : hashtag,
        //                       "email" :  email,
        //                       "frcal" : frcal,
        //                       "tocal" : tocal,
        //                       "twitter" : twitter,
        //                      "name"    : name
        //                 },
        //         contentType: 'application/X-www-form-urlencoded',
        //         url: 'http://localhost:4100/dbUserinsert'
        //     });
        //    http.post 변경전까지 구성요소바꿈 
        //   this.searchajax(hashtag,addinfo);
        //    console.log("서치 완료")
        this.changeState('appState', 'default');
        this.VailidateForm.reset();
    };
    //500개 기준잡음 성능 좋게방법이.... 11/02 
    CollectComponent.prototype.searchajax = function (data, addinfo) {
        //1
        var promis = $.ajax({
            url: 'http://localhost:4100/collectSearch',
            type: 'POST',
            async: false,
            data: {
                query: {
                    "hashtag": data,
                    "since_id": this.since_id,
                    "addinfo": addinfo
                }
            }
        });
        promis.then(this.searchajax2);
    };
    CollectComponent.prototype.searchajax2 = function (res) {
        // 2
        if (res.data.length < 100) {
            console.log('100개 미만');
            for (var i = 0; i < res.data.length; i++) {
                $.ajax({
                    type: 'POST',
                    data: {
                        "hashtag": res.searchquery,
                        "name": res.addinfo.name,
                        "email": res.addinfo.email,
                        "frcal": res.addinfo.frcal,
                        "tocal": res.addinfo.tocal,
                        "twitter": res.addinfo.twitter,
                        "SearchResult": res.data[i]
                    },
                    contentType: 'application/X-www-form-urlencoded',
                    url: 'http://localhost:4100/dbinsert'
                });
            }
        }
        else if (res.data.statuses != undefined) {
            console.log(res.data);
            $.ajax({
                url: 'http://localhost:4100/collectSearch',
                type: 'POST',
                async: false,
                data: {
                    query: {
                        "hashtag": res.searchquery,
                        "since_id": JSON.stringify(res.data.search_metadata.next_results).slice(9, 27),
                        "addinfo": res.addinfo
                    }
                },
                success: function (res) {
                    if (res.data.length != 200 && res.data.statuses == undefined) {
                        console.log('200개 미만');
                        for (var i = 0; i < res.data.length; i++) {
                            $.ajax({
                                type: 'POST',
                                data: {
                                    "hashtag": res.searchquery,
                                    "name": res.addinfo.name,
                                    "email": res.addinfo.email,
                                    "frcal": res.addinfo.frcal,
                                    "tocal": res.addinfo.tocal,
                                    "twitter": res.addinfo.twitter,
                                    "SearchResult": res.data[i]
                                },
                                contentType: 'application/X-www-form-urlencoded',
                                url: 'http://localhost:4100/dbinsert'
                            });
                        }
                    }
                    else if (res.data.statuses != undefined) {
                        //3
                        console.log(res.data);
                        $.ajax({
                            url: 'http://localhost:4100/collectSearch',
                            type: 'POST',
                            async: false,
                            data: {
                                query: {
                                    "hashtag": res.searchquery,
                                    "since_id": JSON.stringify(res.data.search_metadata.next_results).slice(9, 27),
                                    "addinfo": res.addinfo
                                }
                            },
                            success: function (res) {
                                if (res.data.length != 300 && res.data.statuses == undefined) {
                                    console.log('300개 미만');
                                    for (var i = 0; i < res.data.length; i++) {
                                        $.ajax({
                                            type: 'POST',
                                            data: {
                                                "hashtag": res.searchquery,
                                                "name": res.addinfo.name,
                                                "email": res.addinfo.email,
                                                "frcal": res.addinfo.frcal,
                                                "tocal": res.addinfo.tocal,
                                                "twitter": res.addinfo.twitter,
                                                "SearchResult": res.data[i]
                                            },
                                            contentType: 'application/X-www-form-urlencoded',
                                            url: 'http://localhost:4100/dbinsert'
                                        });
                                    }
                                }
                                else if (res.data.statuses != undefined) {
                                    console.log(res.data);
                                    $.ajax({
                                        url: 'http://localhost:4100/collectSearch',
                                        type: 'POST',
                                        async: false,
                                        data: {
                                            query: {
                                                "hashtag": res.searchquery,
                                                "since_id": JSON.stringify(res.data.search_metadata.next_results).slice(9, 27),
                                                "addinfo": res.addinfo
                                            }
                                        },
                                        success: function (res) {
                                            //5
                                            if (res.data.length != 400 && res.data.statuses == undefined) {
                                                console.log('400개 미만');
                                                for (var i = 0; i < res.data.statuses.length; i++) {
                                                    $.ajax({
                                                        type: 'POST',
                                                        data: {
                                                            "hashtag": res.searchquery,
                                                            "name": res.addinfo.name,
                                                            "email": res.addinfo.email,
                                                            "frcal": res.addinfo.frcal,
                                                            "tocal": res.addinfo.tocal,
                                                            "twitter": res.addinfo.twitter,
                                                            "SearchResult": res.data[i]
                                                        },
                                                        contentType: 'application/X-www-form-urlencoded',
                                                        url: 'http://localhost:4100/dbinsert'
                                                    });
                                                }
                                            }
                                            else if (res.data.statuses != undefined) {
                                                console.log(res.data);
                                                $.ajax({
                                                    url: 'http://localhost:4100/collectSearch',
                                                    type: 'POST',
                                                    async: false,
                                                    data: {
                                                        query: {
                                                            "hashtag": res.searchquery,
                                                            "since_id": JSON.stringify(res.data.search_metadata.next_results).slice(9, 27),
                                                            "addinfo": res.addinfo
                                                        }
                                                    },
                                                    success: function (res) {
                                                        for (var i = 0; i < res.data.statuses.length; i++) {
                                                            $.ajax({
                                                                type: 'POST',
                                                                data: {
                                                                    "hashtag": res.searchquery,
                                                                    "name": res.addinfo.name,
                                                                    "email": res.addinfo.email,
                                                                    "frcal": res.addinfo.frcal,
                                                                    "tocal": res.addinfo.tocal,
                                                                    "twitter": res.addinfo.twitter,
                                                                    "SearchResult": res.data[i]
                                                                },
                                                                contentType: 'application/X-www-form-urlencoded',
                                                                url: 'http://localhost:4100/dbinsert'
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
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
            { headerName: "소셜미디어", field: "sns", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        ];
    };
    CollectComponent.prototype.createColumnDefs2 = function () {
        return [
            { headerName: "hashtag", field: "searchquery", sortingOrder: ["asc", "desc"], editable: false, hide: false, width: 80 },
            { headerName: "날짜", field: "date", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "소셜미디어", field: "sns", sortingOrder: ["asc", "desc"], editable: false, hide: false },
            { headerName: "내용", field: "text", sortingOrder: ["asc", "desc"], editable: false, hide: false, width: 300 },
            { headerName: "이미지", field: "image", sortingOrder: ["asc", "desc"], editable: false, hide: false, width: 300 },
        ];
    };
    CollectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'collect',
            templateUrl: 'collect.component.html',
            styleUrls: ['collect.component.css']
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, forms_1.FormBuilder])
    ], CollectComponent);
    return CollectComponent;
}());
exports.CollectComponent = CollectComponent;
//# sourceMappingURL=collect.component.js.map