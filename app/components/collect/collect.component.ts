import { Component,Input,OnInit,Injectable,OnDestroy } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {Collect}  from '../collect';
import {GridOptions} from 'ag-grid/main';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare  var $:any;


@Component({
    moduleId:module.id,
    selector: 'collect',
    templateUrl: 'collect.component.html',
     styleUrls: ['collect.component.css']

})
@Injectable()
export class CollectComponent implements OnInit,OnDestroy {
    public gridOptions:GridOptions;
    public gridOptions2:GridOptions;

    SumArrayData = new Array(new Array(0));
    
 VailidateForm : FormGroup;

 constructor(private http:Http,fb: FormBuilder){
        //그리드 옵션 정리
        this.gridOptions = <GridOptions>{};
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions2 = <GridOptions>{};
        this.gridOptions2.columnDefs = this.createColumnDefs2();

    

        //validate check
        this.VailidateForm = fb.group({
        'email' : [null, Validators.required],
        'id' : [null, Validators.required],
        'hashtag' : [null , Validators.required],
        'date' : [null , Validators.required]
      })
      console.log(this.VailidateForm);
      this.VailidateForm.valueChanges.subscribe( (form: any) => {
        // console.log('form changed to:', form);
      }
    );

        
 }

    //static 변수 
    resultData  :any  
    searchdata : any
    ngcount = 0 
    collect : Collect[];
    since_id = "0" 
    max_id = "0"
    tempdata :any
  

onRowClicked(event: any) { 
      //결과값 hide 비동기써서 그리드 로드 시키고 api 셋로우 데이터
      this.searchdata = event.data;
      
       var query = {
                        "name" : this.searchdata.name,
                        "hashtag" : this.searchdata.hashtag
       }
       
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json')
        this.http.post('http://localhost:4100/searchid',query,{headers: headers}).subscribe((res) => {
        this.resultData = res.json(); 

        
         this.gridOptions2.api.setRowData(this.resultData)     
         var resultsearch_show = document.getElementById("resultsearch").style.display='inline';    
         });
}

ngOnInit(){
    //테스트위해 잠심 11/02
     var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('http://localhost:4100/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
        });
        
        console.log("권한 활성화");

     this.collect = [];
      var headers = new Headers(); 
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:4100/dbsearch', {headers: headers}).subscribe((res) => {
      this.collect = res.json();
      this.gridOptions.api.setRowData(res.json()) 
      var resultsearch_hide = document.getElementById("resultsearch").style.display='none';
        });
   
  }
 
 changeState(state, key){
    console.log('Changing state to: '+state);
    if(key){
      console.log('Changing key to: '+key);
      this.activeKey = key;
    }
    this.appState = state;
         //temp validate check
 
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
  // Hashtag search&insert count maximum 500 2016/10/30
  // 11/02 날짜 저장값 때문에 임시블록
    $.ajax({
            type: 'POST',
                data: {
                          "hashtag" : hashtag,
                          "email" :  email,
                          "frcal" : frcal,
                          "tocal" : tocal,
                          "twitter" : twitter,
                         "name"    : name
                        
                    },
            contentType: 'application/X-www-form-urlencoded',
            url: 'http://localhost:4100/dbUserinsert'
        });
   this.searchajax(hashtag,addinfo);
   console.log("서치 완료")
   this.changeState('appState','default')
   this.VailidateForm.reset()
  }
  //500개 기준잡음 성능 좋게방법이.... 11/02 
  searchajax(data:any,addinfo:any)
  {
    //1
    var promis = $.ajax({
        url: 'http://localhost:4100/collectSearch',
        type: 'POST',
        async: false, //sync
        data: {
            query: {
                "hashtag" : data,
                "since_id" : this.since_id,
                "addinfo" : addinfo
            }
        }   
    })
    promis.then(this.searchajax2)
  }
  searchajax2(res:any)
  { 
    // 2
     if(res.data.length < 100)
        {
            console.log('100개 미만')

             for(var i = 0 ; i < res.data.length ; i++)
             {
                    $.ajax({
                    type: 'POST',
                        data: {
                                    "hashtag" : res.searchquery,
                                    "name"   : res.addinfo.name,
                                    "email" :  res.addinfo.email,
                                    "frcal" : res.addinfo.frcal,
                                    "tocal" : res.addinfo.tocal,
                                    "twitter" : res.addinfo.twitter,
                                    "SearchResult" : res.data[i]
                            },
                    contentType: 'application/X-www-form-urlencoded',
                    url: 'http://localhost:4100/dbinsert'
                });
             }
        }
      else if(res.data.statuses != undefined)
      {
        console.log(res.data)
        $.ajax({
            url: 'http://localhost:4100/collectSearch',
            type: 'POST',
            async: false,
            data: {
                query: {
                    "hashtag" : res.searchquery,
                    "since_id" : JSON.stringify(res.data.search_metadata.next_results).slice(9,27),
                    "addinfo" : res.addinfo
                }
            },
            success : function(res:any)
            { 
            if(res.data.length != 200 && res.data.statuses == undefined)
            {
                console.log('200개 미만')
                for(var i = 0 ; i < res.data.length ; i++)
                    {
                            $.ajax({
                            type: 'POST',
                                data: {
                                            "hashtag" : res.searchquery,
                                            "name"   : res.addinfo.name,
                                            "email" :  res.addinfo.email,
                                            "frcal" : res.addinfo.frcal,
                                            "tocal" : res.addinfo.tocal,
                                            "twitter" : res.addinfo.twitter,
                                            "SearchResult" : res.data[i]
                                    },
                            contentType: 'application/X-www-form-urlencoded',
                            url: 'http://localhost:4100/dbinsert'
                        });
                    }
            }
            else if(res.data.statuses != undefined)
            {
            //3
            console.log(res.data)
                $.ajax({
                    url: 'http://localhost:4100/collectSearch',
                    type: 'POST',
                    async: false,
                    data: {
                        query: {
                            "hashtag" : res.searchquery,
                            "since_id" : JSON.stringify(res.data.search_metadata.next_results).slice(9,27),
                            "addinfo" : res.addinfo
                        }
                    },
                    success : function(res:any)
                    {  
                        if(res.data.length != 300 && res.data.statuses == undefined)
                            {
                                console.log('300개 미만')
                            for(var i = 0 ; i < res.data.length ; i++)
                                {
                                        $.ajax({
                                        type: 'POST',
                                            data: {
                                                        "hashtag" : res.searchquery,
                                                        "name"   : res.addinfo.name,
                                                        "email" :  res.addinfo.email,
                                                        "frcal" : res.addinfo.frcal,
                                                        "tocal" : res.addinfo.tocal,
                                                        "twitter" : res.addinfo.twitter,
                                                        "SearchResult" : res.data[i]
                                                },
                                        contentType: 'application/X-www-form-urlencoded',
                                        url: 'http://localhost:4100/dbinsert'
                                    });
                                }
                            }
                        else if(res.data.statuses != undefined)
                        {
                        console.log(res.data)
                        $.ajax({
                            url: 'http://localhost:4100/collectSearch',
                            type: 'POST',
                            async: false,
                            data: {
                                query: {
                                    "hashtag" : res.searchquery,
                                    "since_id" : JSON.stringify(res.data.search_metadata.next_results).slice(9,27),
                                    "addinfo" : res.addinfo
                                }
                            },
                            success : function(res:any)
                            {
                                //5
                                    if(res.data.length != 400 && res.data.statuses == undefined)
                                    {
                                        console.log('400개 미만')
                                   for(var i = 0 ; i < res.data.statuses.length ; i++)
                                        {
                                                $.ajax({
                                                type: 'POST',
                                                    data: {
                                                                "hashtag" : res.searchquery,
                                                                "name"   : res.addinfo.name,
                                                                "email" :  res.addinfo.email,
                                                                "frcal" : res.addinfo.frcal,
                                                                "tocal" : res.addinfo.tocal,
                                                                "twitter" : res.addinfo.twitter,
                                                                "SearchResult" : res.data[i]
                                                        },
                                                contentType: 'application/X-www-form-urlencoded',
                                                url: 'http://localhost:4100/dbinsert'
                                            });
                                        }
                                                        }
                                    else if  (res.data.statuses != undefined)
                                    {
                                    console.log(res.data)
                                    $.ajax({
                                        url: 'http://localhost:4100/collectSearch',
                                        type: 'POST',
                                        async: false,
                                        data: {
                                            query: {
                                                "hashtag" : res.searchquery,
                                                "since_id" : JSON.stringify(res.data.search_metadata.next_results).slice(9,27),
                                                "addinfo" : res.addinfo
                                            }
                                        },
                                        success : function(res:any)
                                        {
                                            for(var i = 0 ; i < res.data.statuses.length ; i++)
                                                    {
                                                            $.ajax({
                                                            type: 'POST',
                                                                data: {
                                                                            "hashtag" : res.searchquery,
                                                                            "name"   : res.addinfo.name,
                                                                            "email" :  res.addinfo.email,
                                                                            "frcal" : res.addinfo.frcal,
                                                                            "tocal" : res.addinfo.tocal,
                                                                            "twitter" : res.addinfo.twitter,
                                                                            "SearchResult" : res.data[i]
                                                                    },
                                                            contentType: 'application/X-www-form-urlencoded',
                                                            url: 'http://localhost:4100/dbinsert'
                                                        });
                                                    }
                                        }
                                    })
                                    }
                            }
                        })
                        }
                }
            })
        } 
        }
    })
  }
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
    
  private createColumnDefs2() {
        return [
        { headerName: "Name", field: "name", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "hashtag", field: "hashtag", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "tocal", field: "tocal", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "소셜미디어", field: "twitter", sortingOrder: ["asc", "desc"], editable: false, hide: false },
    

        ];
    }
    
   

 }
