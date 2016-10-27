import { Component,OnInit,Injectable } from '@angular/core';
import { Http,Headers} from '@angular/http';
import {CollectComponent} from '../collect/collect.component'
import {GridOptions} from 'ag-grid/main';

declare  var $:any;


@Component({
    moduleId:module.id,
    selector: 'ag-search-grid-component',
    templateUrl: 'searchgrid.component.html'
    
})
@Injectable()
export class searchgridComponent implements OnInit {
    receiveData :any   //rowclick 이벤트값 받는값
    resultData  :any   //result값 받기
  public  gridOptions:GridOptions;
      constructor(private http:Http,private _CollectComponent:CollectComponent){
        this.gridOptions = <GridOptions>{};
        this.gridOptions.columnDefs = this.createColumnDefs();  

        
    }
 


 ngOnInit(){
        
        this.receiveData = this._CollectComponent.searchdata;
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/X-www-form-urlencoded')
        this.http.post('http://localhost:4100/searchid',this.receiveData.name,{headers: headers}).subscribe((res) => {
        console.log(res.json());
        this.resultData = res.json(); 
         this.gridOptions.api.setRowData(this.resultData)  
         });
  }

  callback()
  {  
      
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