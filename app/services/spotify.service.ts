import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_TOKEN = 'AIzaSyB2QPeJGn6xo9rrjjzZrk9OT33aO-Ubzxo';

@Injectable()
export class SpotifyService{
    private searchUrl: string;
    
    constructor(private _http:Http){
        
    }
    
    searchMusic(str:string, type='artist'){
        this.searchUrl = 'https://api.spotify.com/v1/search?query='+str+'&offset=0&limit=20&type='+type+'&market=US';
        return this._http.get(this.searchUrl)
        .map(res => res.json());
    }
 
    searchYoutube(str:string)
    {   
     
        return  this._http.get(`${BASE_URL}?q=${str}&part=snippet&key=${API_TOKEN}`)
       .map(res => res.json());
    
    }
    // searchtwitter(str:string)
    // {   
    //     var bearerheader = 'Bearer ' + consumerapi;
    //     return  this._http.get(`https://api.twitter.com/1.1/search/tweets.json?q=`+str+'&result_type=recent&count=20&include_entities=true&filter:media',{headers: bearerheader})
    //    .map(res => res.json());
    
    
    // }
}