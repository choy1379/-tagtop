import { Component,Input,OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';

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
  width:286px;
  height:200px;

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
  float: left,right;
   background-image: black;
}
.card-title {
  width : 300px;
  font-size : 15px;

}

.card-content{
  font-size: 13px;
    width:270px;
    background-image: black;

}
.col{
     border: 1px solid white;
     background-color : solid white;
    }
.col-sm-3{
     margin-top : 20px;
     margin-left : 20px;
     width : 286px
     height: 300px;
    }
  `]
})
export class SearchComponent {
    searchquery='';
    searchStr:string;
    tweetsdata:any;


    constructor(private http: Http){
    }
     makecall(){
            var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('http://localhost:4100/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
            
                  
        });
    }
    searchcall(){
    var headers = new Headers();
    var searchterm = 'query=' + this.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    
    this.http.post('http://localhost:4100/search', searchterm, {headers: headers}).subscribe((res) => {
       this.tweetsdata = res.json().data.statuses;  // Tweetdata


    }); 
    }

    
    

    // searchMusic(){
    //     this._spotifyService.searchMusic(this.searchStr).subscribe(res => {
    //         console.log(res.artists.items);
    //     });
    // }
}
