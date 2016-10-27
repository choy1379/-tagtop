import {searchgridComponent} from '../searchgrid/searchgrid.component';
import { Component,Input,OnInit,Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {Collect}  from '../collect';
import {CommonModule} from "@angular/common"
import {FormsModule} from "@angular/forms"
import {GridOptions} from 'ag-grid/main';
declare  var $:any;


@Component({
    moduleId:module.id,
    selector: 'collect',
    templateUrl: 'collect.component.html',
     styleUrls: ['collect.component.css'],
    //  providers: [searchgridComponent]
})
@Injectable()
export class CollectComponent implements OnInit {
    public gridOptions:GridOptions;

 constructor(private http:Http){

        this.gridOptions = <GridOptions>{};
        this.gridOptions.columnDefs = this.createColumnDefs();
 }

     resultData  :any   //result값 받기
    searchdata : any
    tempdata : any 
    ngcount=0 
 collect : Collect[];

onRowClicked(event: any) { 
        this.searchdata = event.data;
      this.changeState('searchResult');
  //  this._searchgrid.callback(this.searchdata

}

 ngOnInit(){
   
     this.collect = [];
      var headers = new Headers(); 
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:4100/dbsearch', {headers: headers}).subscribe((res) => {
      this.collect = res.json();
      this.gridOptions.api.setRowData(res.json()) 
        });
   
  }
  
 changeState(state, key){
    console.log('Changing state to: '+state);
    if(key){
      console.log('Changing key to: '+key);
      this.activeKey = key;
    }
    this.appState = state;
  }

   addinfo(
    email:string,
    name:string,
    hashtag:string,
    frcal:string,
    tocal:string,
     twitter:string,

    ){
     
      

      var addinfo = {
        email:email,
        name: name,
        hashtag: hashtag,
        frcal: frcal,
        tocal: tocal,
        twitter:twitter
      }
      
   
      console.log(addinfo);
     
        // ajax로 send 해봄 
        $.ajax({
        type: 'POST',
        data: addinfo,
        contentType: 'application/X-www-form-urlencoded',
        url: 'http://localhost:4100/dbinsert'
      });
      
      this.changeState('default');
  }
  inputcal()
  {
    $('#frcal').datepicker({
      dateFormat: "yy-mm-dd",
      dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
      dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'], 
      monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
   });
   $('#tocal').datepicker({
      dateFormat: "yy-mm-dd",
      dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
      dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'], 
      monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
   });
  
  }

    private createColumnDefs() {
        return [
        { headerName: "ID", field: "_id", sortingOrder: ["asc", "desc"], editable: false, width: 100 },
        { headerName: "Name", field: "name", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "hashtag", field: "hashtag", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "tocal", field: "tocal", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "소셜미디어", field: "twitter", sortingOrder: ["asc", "desc"], editable: false, hide: false },
    

        ];
    }
    

    

 }
