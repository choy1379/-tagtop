import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TwitterService{
    private searchUrl: string;
    private moreinfoUrl: string 
    
    constructor(private _http:Http){
        
    }
    
 getMoreInfoUrl(id:string){
// "https://twitter.com/Jinher22/status/{{res.id_str}}"
 }
    
 

       
}