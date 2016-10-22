import { Component } from '@angular/core';
import {SpotifyService} from './services/spotify.service';
import {TwitterService} from './services/twitter.service';

@Component({
    moduleId:module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [SpotifyService,TwitterService]
    
})
export class AppComponent { }
