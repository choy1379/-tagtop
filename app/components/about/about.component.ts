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

 }
