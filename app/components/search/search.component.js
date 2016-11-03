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
var spotify_service_1 = require('../../services/spotify.service');
require('rxjs/add/operator/map');
var SearchComponent = (function () {
    function SearchComponent(http, _spotifyService) {
        this.http = http;
        this._spotifyService = _spotifyService;
        this.searchquery = '아이린';
        this.readmore_count = 0;
        this.data = new Array();
        this.SumArrayData = new Array(new Array(0), new Array(0));
        this.myAction = function (res) {
            var divTest = document.getElementById("test").style.display = 'block';
            var divTest2 = document.getElementById("test2").style.display = 'inline';
            if (res.kind == "youtube#searchResult") {
                console.log(res.id.videoId);
                // 이전값들 지워줘야된다 try,catch문 고려, 위에 선언을 document.id 까지선언하고 밑에서 세부사항 수정하도록 고려
                var youtubedisplay = document.getElementById("player").style.display = 'inline';
                var user_Profile = document.getElementById("user_profile").setAttribute('src', '');
                var detailUsers = document.getElementById("moreinfo").setAttribute('href', '');
                var user_Names = document.getElementById("user_name").innerHTML = '';
                var postlink = document.getElementById("post_link").setAttribute('href', '');
                var target = document.getElementById("targetlink").setAttribute('href', '');
                var target_htmls = document.getElementById("targetlink").innerHTML = '';
                var user_time = document.getElementById("user_time").innerHTML = '';
                var contents = document.getElementById("content").innerHTML = '';
                var k = "http://www.youtube.com/embed/" + res.id.videoId + "?enablejsapi=1&theme=light&showinfo=0";
                var youtubecontents = document.getElementById("player").setAttribute('src', k);
                var detail_content = document.getElementById("fancybox_skin").setAttribute('style', 'width:430px;');
                var youtube_contents_text = document.getElementById("content").innerHTML = res.snippet.description;
                var postlinks = document.getElementById("postlink").style.display = 'none';
                console.log(res);
            }
            else {
                var detailUser = document.getElementById("moreinfo");
                var user_Profile = document.getElementById("user_profile").setAttribute('src', res.user.profile_image_url_https);
                var detailUser_set = "https://twitter.com/" + res.user.screen_name;
                detailUser.setAttribute('href', detailUser_set);
                var user_Name = document.getElementById("user_name").innerHTML = res.user.name;
                var postlink = document.getElementById("post_link").setAttribute('href', "https://twitter.com/Jinher22/status/" + res.id_str);
                if (res.entities.urls.length != 0) {
                    console.log("in if 문");
                    for (var i in res.entities.urls) {
                        console.log("in foreach문");
                        var target = document.getElementById("targetlink").setAttribute('href', res.entities.urls[i].url);
                        var target_html = document.getElementById("targetlink").innerHTML = res.entities.urls[i].url;
                    }
                }
                //usertime 
                var system_date = Date.parse(res.created_at.replace(/( \+)/, ' UTC$1'));
                var user_date = +new Date();
                var diff = Math.floor((user_date - system_date) / 1000);
                var usertime = "";
                if (diff <= 1) {
                    usertime = "방금";
                }
                else if (diff < 20) {
                    usertime = diff + " 분 전";
                }
                else if (diff < 40) {
                    usertime = "방금 전 에";
                }
                else if (diff < 60) {
                    usertime = "1분도 안 되서";
                }
                else if (diff <= 90) {
                    usertime = "1 분 전";
                }
                else if (diff <= 3540) {
                    usertime = Math.round(diff / 60) + " 분 전";
                }
                else if (diff <= 5400) {
                    usertime = "1 시간 전";
                }
                else if (diff <= 86400) {
                    usertime = Math.round(diff / 3600) + " 시간 전";
                }
                else if (diff <= 129600) {
                    usertime = "1 일 전";
                }
                else if (diff < 604800) {
                    usertime = Math.round(diff / 86400) + " 일 전";
                }
                else if (diff <= 777600) {
                    usertime = "1 주일 전";
                }
                var user_time = document.getElementById("user_time").innerHTML = usertime;
                var content = document.getElementById("content").innerHTML = res.text;
                if (res.entities.media != Object) {
                    var content_image_none = document.getElementById("content_image").setAttribute('style', '');
                    var content_image = document.getElementById("content_image").setAttribute('src', res.entities.media[0].media_url + ":small");
                    var content = document.getElementById("content").innerHTML = res.text;
                }
            }
        };
        this.Close = function () {
            var divTest = document.getElementById("test").style.visibility = 'visible';
            var divTest2 = document.getElementById("test2").style.display = 'none';
            var content_image_src = document.getElementById("content_image").setAttribute('src', '');
            var content_image_none = document.getElementById("content_image").style.display = 'none';
            var target_none = document.getElementById("targetlink").setAttribute('href', '');
            var target_html = document.getElementById("targetlink").innerHTML = "";
            var youtubecontents = document.getElementById("player").setAttribute('src', '');
            var youtubedisplay = document.getElementById("player").style.display = 'none';
            var postlinks = document.getElementById("postlink").style.display = 'inline';
        };
    }
    SearchComponent.prototype.makecall = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        this.http.post('http://localhost:4100/authorize', { headers: headers }).subscribe(function (res) {
            console.log(res);
        });
    };
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        this.http.post('http://localhost:4100/authorize', { headers: headers }).subscribe(function (res) {
            console.log(res);
        });
        console.log("권한 활성화");
        //네이버위젯같은거 초반값
        var headers = new http_1.Headers();
        var searchterm = 'query=' + this.searchquery;
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        this.http.post('http://localhost:4100/search', searchterm, { headers: headers }).subscribe(function (res) {
            _this.data[0] = res.json().data.statuses;
        });
        this._spotifyService.searchYoutube(this.searchquery).subscribe(function (res) {
            _this.data[1] = res.items;
        });
    };
    SearchComponent.prototype.searchcall = function () {
        var _this = this;
        if (this.readmore_count > 1 || this.readmore_count == 0) {
            if (this.lquery != this.searchquery) {
                var headers = new http_1.Headers();
                var searchterm = 'query=' + this.searchquery;
                // //2016-10-28 그리드 서치쿼리 테스트 
                // var searchterm = 'query=' + this.searchquery + 'maxid='+ maxids;
                //
                headers.append('Content-Type', 'application/X-www-form-urlencoded');
                this.http.post('http://localhost:4100/search', searchterm, { headers: headers }).subscribe(function (res) {
                    _this.tweetsdata = res.json().data.statuses;
                    _this.tweetsArray = JSON.parse(JSON.stringify(_this.tweetsdata));
                    _this.lquery = _this.searchquery;
                    _this.readmore_count = 0;
                    _this.SumArrayData[0] = new Array();
                    for (var i = 0; i < 5; i++) {
                        _this.SumArrayData[0][i] = _this.tweetsArray[i];
                    }
                    for (var i = 0; _this.YoutubeArray.length > i; i++) {
                        _this.SumArrayData[0][_this.SumArrayData[0].length] = _this.YoutubeArray[i];
                    }
                    _this.SumArrayData[0].sort(function () { return 0.5 - Math.random(); });
                });
                this._spotifyService.searchYoutube(this.searchquery).subscribe(function (res) {
                    _this.youtubeResult = res.items;
                    _this.YoutubeArray = JSON.parse(JSON.stringify(_this.youtubeResult));
                });
            }
        }
        else {
            var headers = new http_1.Headers();
            var searchterm = 'query=' + this.searchquery;
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            this.http.post('http://localhost:4100/search', searchterm, { headers: headers }).subscribe(function (res) {
                _this.tweetsdata = res.json().data.statuses;
                _this.tweetsArray = JSON.parse(JSON.stringify(_this.tweetsdata));
                _this.lquery = _this.searchquery;
                _this.SumArrayData[0] = new Array();
                for (var i = 0; i < 5; i++) {
                    _this.SumArrayData[0][i] = _this.tweetsArray[i];
                }
                for (var i = 0; _this.YoutubeArray.length > i; i++) {
                    _this.SumArrayData[0][_this.SumArrayData[0].length] = _this.YoutubeArray[i];
                }
                _this.SumArrayData[0].sort(function () { return 0.5 - Math.random(); });
            });
            this._spotifyService.searchYoutube(this.searchquery).subscribe(function (res) {
                _this.youtubeResult = res.items;
                _this.YoutubeArray = JSON.parse(JSON.stringify(_this.youtubeResult));
            });
        }
        var readmore = document.getElementById("readmore").style.display = 'block';
        var searchloading = document.getElementById("loading").style.display = 'inline';
    };
    SearchComponent.prototype.readmore = function () {
        this.readmore_count++;
        //3번최대 걸어두고 한페이지최대 60개로 제한
        if (this.readmore_count < 4) {
            switch (this.readmore_count) {
                case 1:
                    for (var i = 10; i < 15; i++) {
                        this.SumArrayData[0][i] = this.tweetsArray[i];
                    }
                    break;
                case 2:
                    for (var i = 15; i < 20; i++) {
                        this.SumArrayData[0][i] = this.tweetsArray[i];
                    }
                    break;
                case 3:
                    for (var i = 20; i < 25; i++) {
                        this.SumArrayData[0][i] = this.tweetsArray[i];
                    }
                    break;
            }
        }
        else {
            alert("더보기는 3번으로 제한됩니다 ");
        }
        //jquey 샘플
        // $('#readmore').on('click', function() {$('#searchcall').trigger('click',this.readmore_Count); });
    };
    SearchComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'search',
            templateUrl: 'search.component.html',
            styles: ["\n    .color1 {\n\t\t\tcolor:black;\n\t\t}\n\n.loading\n{\n  position: relative;\n    width: 100%;\n    height: 600px;\n    padding: 10px 0px;\n    text-align: center;\n    text-indent: -9999px;\n    // background-image: url(\"../../source/fancybox_loading.gif\");\n}\n.card {\n  margin-top: 20px;\n  margin-left: 20px;\n  width:286px;\n  height:280px;\n\n}\n\n.youtubecard {\n  margin-top: 20px;\n  width:100%;\n  height:280px;\n\n}\n.youtubetop\n{\n    position: relative;\n    width: 100%;\n    height: 180px;\n    overflow: hidden;\n    text-align: center;\n}\n.youtubetext\n{\n\n    width: 100%;\n    height:auto;\n\n}\n.card-image {\n  float: left;\n  width: 40px;\n  height: 40px;\n}\n.card-image img {\n  height: 80%;\n  width: 80%;\n}\n.right-content {\n  width: 100%;\n  float: left;\n   background-image: black;\n}\n.card-title {\n  width : 100%;\n  font-size : 15px;\n\n}\n\n.card-content{\n  font-size: 13px;\n    width:100%;\n    height:171px;\n    background-image: black;\n\n}\n.col{\n     border: 1px solid white;\n     border-top-left-radius:5%;\n     border-top-right-radius:5%;\n     border-bottom-left-radius:5%;\n     border-bottom-right-radius:5%;\n     background-color : solid white;\n    }\n.col-sm-4{\n     margin-top : 20px;\n     margin-left : 20px;\n     width : 286px\n     height: 300px;\n    // display: inline-block;\n    }\n.readmore{\n   position: relative;\n    width: 100%;\n    padding: 10px 0px;\n    text-align: center;\n    font-size: 1.5em;\n    font-weight: bold;\n    cursor: pointer;\n    background: #ddd;\n    color: black;\n    margin: 10px 0px;\n\n}\n.imagesizes{\n width: 80%; height: auto;\n}\n.content-image{\n  height:auto;\n}\n#card:hover{background-color:#dcdcdc  ;\n }\n\n  "]
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, spotify_service_1.SpotifyService])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=search.component.js.map