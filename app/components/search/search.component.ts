import { Component,Input,OnInit,Injectable,ViewChild } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {SpotifyService} from '../../services/spotify.service';
import 'rxjs/add/operator/map';

declare  var $:any;


@Component({
    moduleId:module.id,
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.style.css']
})
@Injectable()
export class SearchComponent implements OnInit{
    searchquery='아이린';
    searchStr:string;
    tweetsdata:any;
    youtubeResult:any;
     tweetsArray:any;
     YoutubeArray:any;
     readmore_count=0;
    data = new Array();
    SumArrayData = new Array( new Array(0), new Array(0) );
    lquery :any;
    dbsearch : any;

  //   @ViewChild('user_name') user_name:ElementRef;
  //      ngAfterViewInit() {
  //      console.log(this.user_name)
  //  }

    constructor(private http: Http,private _spotifyService:SpotifyService){
    }
    loading: boolean; 
     makecall(){
            var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('http://localhost:4100/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
        });
    }
     ngOnInit(){
              var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('http://localhost:4100/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
        });
        
        console.log("권한 활성화");
    
    //네이버위젯같은거 초반값
    var headers = new Headers();
    var searchterm = 'query=' + this.searchquery;
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('http://localhost:4100/search', searchterm, {headers: headers}).subscribe((res) => {
        this.data[0] = res.json().data.statuses;
        }); 
    this._spotifyService.searchYoutube(this.searchquery).subscribe(res => {
        this.data[1] = res.items
        });

     }
    searchcall(){

     this.loading = true 

     if(this.readmore_count>1 || this.readmore_count ==0)
       {
          if(this.lquery != this.searchquery)
          {
          
              var headers = new Headers();
                var searchterm = 'query=' + this.searchquery;
               
                // //2016-10-28 그리드 서치쿼리 테스트 
                // var searchterm = 'query=' + this.searchquery + 'maxid='+ maxids;
                //
                headers.append('Content-Type', 'application/X-www-form-urlencoded');
                this.http.post('http://localhost:4100/search', searchterm, {headers: headers}).subscribe((res) => {
                this.tweetsdata = res.json().data.statuses;  
                this.tweetsArray = JSON.parse(JSON.stringify(this.tweetsdata ));
                this.lquery = this.searchquery;
                this.readmore_count =0;
                this.SumArrayData[0] = new Array();
                  for(var i =0; i<5; i++)
                  {
                    this.SumArrayData[0][i] = this.tweetsArray[i];
                  }
                  for(var i=0; this.YoutubeArray.length>i; i++)
                  {  
                    this.SumArrayData[0][this.SumArrayData[0].length]= this.YoutubeArray[i];
                  }
                  this.SumArrayData[0].sort(function(){return 0.5-Math.random()});
                  this.loading = false 
                }); 

              this._spotifyService.searchYoutube(this.searchquery).subscribe(res => {
              this.youtubeResult = res.items;
              this.YoutubeArray = JSON.parse(JSON.stringify(this.youtubeResult ));
        
                });
       
          }
       }
       else
       {
  
              var headers = new Headers();
              var searchterm = 'query=' + this.searchquery;

            headers.append('Content-Type', 'application/X-www-form-urlencoded');
          
 
                this.http.post('http://localhost:4100/search', searchterm, {headers: headers}).subscribe((res) => {
                this.tweetsdata = res.json().data.statuses;  
                this.tweetsArray = JSON.parse(JSON.stringify(this.tweetsdata ));
                this.lquery = this.searchquery;
                this.SumArrayData[0] = new Array();
                  for(var i =0; i<5; i++)
                  {
                    this.SumArrayData[0][i] = this.tweetsArray[i];
                  }
                  for(var i=0; this.YoutubeArray.length>i; i++)
                  {  
                    this.SumArrayData[0][this.SumArrayData[0].length]= this.YoutubeArray[i];
                  }
                  this.SumArrayData[0].sort(function(){return 0.5-Math.random()});
          
                }); 

              this._spotifyService.searchYoutube(this.searchquery).subscribe(res => {
              this.youtubeResult = res.items;
              this.YoutubeArray = JSON.parse(JSON.stringify(this.youtubeResult ));
        
                });
       }

    var readmore = document.getElementById("readmore").style.display='block';
    var searchloading = document.getElementById("loading").style.display='inline';
    }
    
   readmore()
   {
  
     this.readmore_count ++;

          //3번최대 걸어두고 한페이지최대 60개로 제한
        if(this.readmore_count <4)
        {
          switch (this.readmore_count){
            case 1:
                    for(var i =10; i<15; i++)
                    {
                      this.SumArrayData[0][i] = this.tweetsArray[i];
               
                    }
                    break;
            case 2: 
                  for(var i = 15; i<20; i++)
                  {
                      this.SumArrayData[0][i] = this.tweetsArray[i];
             
                  }
                  break;
            case 3:
                  for(var i= 20; i<25; i++)
                  {
                    this.SumArrayData[0][i] = this.tweetsArray[i];
                  
                  }
                  break;
          }
        }
        else
        {
          alert("더보기는 3번으로 제한됩니다 ")
       
        }
   

          //jquey 샘플
          // $('#readmore').on('click', function() {$('#searchcall').trigger('click',this.readmore_Count); });

   }

     //card 클릭이벤트
     myAction = function(res:any){

    var divTest = document.getElementById("test").style.display='block';
    var divTest2 = document.getElementById("test2").style.display='inline';
    
    if(res.kind == "youtube#searchResult")
    {
      console.log(res.id.videoId)
      // 이전값들 지워줘야된다 try,catch문 고려, 위에 선언을 document.id 까지선언하고 밑에서 세부사항 수정하도록 고려
        var youtubedisplay = document.getElementById("player").style.display='inline';
        var user_Profile= document.getElementById("user_profile").setAttribute('src','');
        var detailUsers = document.getElementById("moreinfo").setAttribute('href','');
        var user_Names = document.getElementById("user_name").innerHTML = '';
        var postlink = document.getElementById("post_link").setAttribute('href','');
        var target = document.getElementById("targetlink").setAttribute('href','');
        var target_htmls= document.getElementById("targetlink").innerHTML='';
        var user_time = document.getElementById("user_time").innerHTML = '';
        var contents = document.getElementById("content").innerHTML = '';
        var k =  "http://www.youtube.com/embed/"+res.id.videoId+"?enablejsapi=1&theme=light&showinfo=0";
        var youtubecontents = document.getElementById("player").setAttribute('src',k);
        var detail_content = document.getElementById("fancybox_skin").setAttribute('style','width:430px;');
        if(res.snippet.description == '')
        {
          var youtube_contents_text = document.getElementById("content").innerHTML = res.snippet.title;
        }
        else
        {
            var youtube_contents_text = document.getElementById("content").innerHTML = res.snippet.description;
        }
        var postlinks = document.getElementById("postlink").style.display = 'none';
        console.log(res);
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
    var postlinks = document.getElementById("postlink").style.display = 'inline';

    }

   


}
