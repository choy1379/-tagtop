import { Component,Input,OnInit,Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {SpotifyService} from '../../services/spotify.service';
import 'rxjs/add/operator/map';

 declare  var $:any;


@Component({
    moduleId:module.id,
    selector: 'search',
    templateUrl: 'search.component.html',
    styles:[`
    .color1 {
			color:black;
		}

.card {
  margin-top: 20px;
  margin-left: 20px;
  width:286px;
  height:280px;

}

.youtubecard {
  margin-top: 20px;
  width:100%;
  height:280px;

}
.youtubetop
{
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    text-align: center;
}
.youtubetext
{

    width: 100%;
    height:auto;

}
.card-image {
  float: left;
  width: 40px;
  height: 40px;
}
.card-image img {
  height: 80%;
  width: 80%;
}
.right-content {
  width: 100%;
  float: left;
   background-image: black;
}
.card-title {
  width : 100%;
  font-size : 15px;

}

.card-content{
  font-size: 13px;
    width:100%;
    height:171px;
    background-image: black;

}
.col{
     border: 1px solid white;
     border-top-left-radius:5%;
     border-top-right-radius:5%;
     border-bottom-left-radius:5%;
     border-bottom-right-radius:5%;
     background-color : solid white;
    }
.col-sm-4{
     margin-top : 20px;
     margin-left : 20px;
     width : 286px
     height: 300px;
    // display: inline-block;
    }
.imagesizes{
 width: 80%; height: auto;
}
.content-image{
  height:auto;
}
#card:hover{background-color:#dcdcdc  ;
 }

  `]
})
@Injectable()
export class SearchComponent implements OnInit{
    searchquery='아이린';
    searchStr:string;
    tweetsdata:any;
    youtubeResult:any;
     b:any;
    data = new Array();
    
    // showDialog = false;
 

    constructor(private http: Http,private _spotifyService:SpotifyService){
    }

     makecall(){
        //     var headers = new Headers();
        //     headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
        //     this.http.post('http://localhost:4100/authorize', {headers: headers}).subscribe((res) => {
        //     console.log(res);     
        // });
    }
     ngOnInit(){
              var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('https://tagtops.herokuapp.com/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
        });
        
        console.log("권한 활성화");
    
    //네이버위젯같은거 초반값
    var headers = new Headers();
    var searchterm = 'query=' + this.searchquery;
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('https://tagtops.herokuapp.com/search', searchterm, {headers: headers}).subscribe((res) => {
        this.data[0] = res.json().data.statuses;
        }); 
    this._spotifyService.searchYoutube(this.searchquery).subscribe(res => {
        this.data[1] = res.items
        });
    ///////////////////
     }
    searchcall(){

     
    var headers = new Headers();
    var searchterm = 'query=' + this.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
  

    this.http.post('https://tagtops.herokuapp.com/search', searchterm, {headers: headers}).subscribe((res) => {
       this.tweetsdata = res.json().data.statuses;  
       this.data[0] = this.tweetsdata;
       
         //  10-17 array 합쳤는데 .. 수정해야됨 
            for(var i=0; this.data[1].length>i; i++)
            {  
                this.data[0][this.data[0].length]= this.b[i];
            }

            this.data[0].sort(function(){return 0.5-Math.random()});

            console.log("1번실행");
 
            
        }); 

    this._spotifyService.searchYoutube(this.searchquery).subscribe(res => {
      this.youtubeResult = res.items;
      this.b = JSON.parse(JSON.stringify(this.youtubeResult ));
       console.log(this.b);
        });
     
   console.log("3번실행");

  



    }
    
  
     myAction = function(res:any){
 
    var divTest = document.getElementById("test").style.display='block';
    var divTest2 = document.getElementById("test2").style.display='inline';
    
    if(res.kind == "youtube#searchResult")
    {
      console.log(res.id.videoId);
      // 이전값들 지워줘야된다 try,catch문 고려, 위에 선언을 document.id 까지선언하고 밑에서 세부사항 수정하도록 고려
      // 2016-10-18 ~ 이번주까지 
      var youtubedisplay = document.getElementById("player").style.display='inline';
       var user_Profile= document.getElementById("user_profile").setAttribute('src','');
        var detailUsers = document.getElementById("moreinfo").setAttribute('href','');
        var user_Names = document.getElementById("user_name").innerHTML = '';
        var postlink = document.getElementById("post_link").setAttribute('href','');
        var target = document.getElementById("targetlink").setAttribute('href','');
        var target_htmls= document.getElementById("targetlink").innerHTML='';
        var user_time = document.getElementById("user_time").innerHTML = '';
        var contents = document.getElementById("content").innerHTML = '';
        var k =  "https://www.youtube.com/embed/"+res.id.videoId+"?enablejsapi=1&theme=light&showinfo=0";
        var youtubecontents = document.getElementById("player").setAttribute('src',k);
        console.log(k);
    }
    else
    {
    var detailUser = document.getElementById("moreinfo");
    var user_Profile= document.getElementById("user_profile").setAttribute('src',res.user.profile_image_url_https);
    var detailUser_set = "https://twitter.com/"+res.user.screen_name;
    detailUser.setAttribute('href',detailUser_set);
    var user_Name = document.getElementById("user_name").innerHTML = res.user.name;
  

    var postlink = document.getElementById("post_link").setAttribute('href',"https://twitter.com/Jinher22/status/"+res.id_str);

     
    
     if(res.entities.urls.length != 0)
    {
      console.log("in if 문");
       for(var i in res.entities.urls)
       {
        console.log("in foreach문");
        var target = document.getElementById("targetlink").setAttribute('href',res.entities.urls[i].url);
        var target_html = document.getElementById("targetlink").innerHTML=res.entities.urls[i].url;
      }

    }

    //usertime 
    var system_date = Date.parse(res.created_at.replace(/( \+)/, ' UTC$1'))
    var user_date = + new Date();
    var diff = Math.floor((user_date - system_date) / 1000);
    var usertime = "";
    if (diff <= 1) {usertime = "방금";}
    else if (diff < 20) {usertime =  diff + " 분 전";}
    else if (diff < 40) {usertime =  "방금 전 에";}
    else if (diff < 60) {usertime =  "1분도 안 되서";}
    else if (diff <= 90) {usertime =  "1 분 전";}
    else if (diff <= 3540) {usertime =  Math.round(diff / 60) + " 분 전";}
    else if (diff <= 5400) {usertime =  "1 시간 전";}
    else if (diff <= 86400) {usertime =  Math.round(diff / 3600) + " 시간 전";}
    else if (diff <= 129600) {usertime =  "1 일 전";}
    else if (diff < 604800) {usertime =  Math.round(diff / 86400) + " 일 전";}
    else if (diff <= 777600) {usertime =  "1 주일 전";}
    var user_time = document.getElementById("user_time").innerHTML = usertime;
 
    var content = document.getElementById("content").innerHTML = res.text;

    if(res.entities.media != Object)
    {       
          var content_image_none = document.getElementById("content_image").setAttribute('style','');
          var content_image = document.getElementById("content_image").setAttribute('src',res.entities.media[0].media_url+":small");
          var content = document.getElementById("content").innerHTML = res.text;
    }
    
    }
  
   }

    Close = function(){
    var divTest = document.getElementById("test").style.visibility='visible';
    var divTest2 = document.getElementById("test2").style.display='none';

    var content_image_src = document.getElementById("content_image").setAttribute('src','');
    var content_image_none = document.getElementById("content_image").style.display='none';

    var target_none = document.getElementById("targetlink").setAttribute('href','');
    var target_html = document.getElementById("targetlink").innerHTML="";
    var youtubecontents = document.getElementById("player").setAttribute('src','');
    var youtubedisplay = document.getElementById("player").style.display='none';

    }

   


}
