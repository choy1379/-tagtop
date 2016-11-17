import { Component,Input,OnInit,Injectable,OnDestroy } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {Collect}  from '../collect';
import {GridOptions} from 'ag-grid/main';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Rx'
declare  var $:any;

@Component({
    moduleId:module.id,
    selector: 'about',
    templateUrl: 'about.component.html'
})
export class AboutComponent implements OnInit {
    constructor(){}


    // ngOnInit(){
    //      var map = new naver.maps.Map('map', {
    //         center: new naver.maps.LatLng(37.3595704, 127.105399),
    //         zoom: 10
    //     });

    //     var marker = new naver.maps.Marker({
    //         position: new naver.maps.LatLng(37.3595704, 127.105399),
    //         map: map
    //     });
         
    // }
 }
