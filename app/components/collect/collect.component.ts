import { Component,Input,OnInit,Injectable,OnDestroy,ViewChild } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {Collect}  from '../collect';
import {GridOptions} from 'ag-grid/main';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Rx'
declare  var $:any;

@Component({
    moduleId:module.id,
    selector: 'collect',
    templateUrl: 'collect.component.html',
     styleUrls: ['collect.component.css']

})
@Injectable()
export class CollectComponent implements OnInit {
    public gridOptions:GridOptions;
    public gridOptions2:GridOptions;


  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  //하단 라벨
  public barChartLabels:string[] = [''];
  //바 타입
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];

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
    httpResultData :any
 
 overimage(event : any ){
    if(event.fromElement.innerText.slice(0,8) == 'https://')
    {           
        var divTop = event.clientY - 20 + 'px'; //상단 좌표
        var divLeft =event.clientX + 10 + 'px'; //좌측 좌표
        document.getElementById("imgViewer").setAttribute('src',event.fromElement.innerText);
        document.getElementById("imgViewer").setAttribute('style','z-index:1; position: absolute; top :'+divTop+';left : '+divLeft+';width: 150px; display:block;')
        console.log(event)
    }
 }
overimagemove(event : any ){
        var divTop = event.clientY - 20 + 'px'; //상단 좌표
        var divLeft =event.clientX + 10 + 'px'; //좌측 좌표
        document.getElementById("imgViewer").setAttribute('style','z-index :1; position: absolute; top :'+divTop+';left : '+divLeft+';width: 150px; display:block;')
}
 overimageout(event : any ){
         document.getElementById("imgViewer").setAttribute('style','display:none;')
}

onRowClicked(event: any) { 

      this.searchdata = event.data;
      
       var query = {
                        "name" : this.searchdata.name,
                        "searchquery" : this.searchdata.hashtag
       }
       
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json')
        this.http.post('https://tagtops.herokuapp.com::4100/searchid',query,{headers: headers}).subscribe((res) => {
        this.resultData = res.json(); 

        //2017-01-10 그래프 부분 
        var TempResultData = new Array()  //수집된데이타 날짜    배열
        var overlapData = new Array()      // 날짜 월 일만 짜른 배열
        var overlapcount = new Array()     // 중복된값 카운트   배열

        for(var i = 0 ; i < this.resultData.length - 1; i ++)
        {
            TempResultData[i] = this.resultData[i]['date'].substring(0,10)
        }
         TempResultData.sort(this.sortDate)
        for(var i = 0 ; i < TempResultData.length; i ++)
        {
            TempResultData[i] = TempResultData[i].substring(5,10)
        }
        //array 중복 제거 
        var uniq = TempResultData.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
        },[]);

        this.barChartLabels = uniq

        for(var value in TempResultData) {

        var index = TempResultData[value]
        overlapData[index] = overlapData[index] == undefined ? 1 : overlapData[index] += 1
        }   
       
        for(var i = 0 ; i< uniq.length; i ++)
        {
            var tempname = uniq[i]
            overlapcount[i] = overlapData[tempname]
        }
        this.barChartData = [{data : overlapcount,label:this.resultData[0]['searchquery']}]

        this.gridOptions2.api.setRowData(this.resultData)     
        var resultsearch_show = document.getElementById("resultsearch").style.display='inline';    
         });
         
}
sortDate(a,b){
        var arr0 = a.split("-");
        var arr1 = b.split("-");
        var date_a = new Date(arr0[0],arr0[1]-1,arr0[2]);
        var date_b = new Date(arr1[0],arr1[1]-1,arr1[2]);
        if (date_a < date_b) return -1;
        if (date_a > date_b) return 1;
        return 0;
}

  public chartClicked(e:any):void {
    // console.log(e);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }
ngOnInit(){
    //테스트위해 잠심 11/02
     var headers = new Headers();
            headers.append('Content-Type', 'application/X-www-form-urlencoded');
            
            this.http.post('https://tagtops.herokuapp.com:4100/authorize', {headers: headers}).subscribe((res) => {
            console.log(res);     
        });
        
        console.log("권한 활성화");

     this.collect = [];
      var headers = new Headers(); 
      headers.append('Content-Type', 'application/json');
      this.http.post('https://tagtops.herokuapp.com:4100/dbsearch', {headers: headers}).subscribe((res) => {
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
    Exportcsv()
    {
        this.gridOptions2.api.exportDataAsCsv('asd');
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

      
       var query = {
                         "hashtag" : hashtag,
                          "email" :  email,
                          "frcal" : frcal,
                          "tocal" : tocal,
                          "twitter" : twitter,
                         "name"    : name
       }
       
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json')
        this.http.post('https://tagtops.herokuapp.com:4100/dbUserinsert',query,{headers: headers}).subscribe((res) => {
               this.gridOptions.api.refreshView();
           this.collect = [];
            var headers = new Headers(); 
            headers.append('Content-Type', 'application/json');
            this.http.post('https://tagtops.herokuapp.com:4100/dbsearch', {headers: headers}).subscribe((res) => {
            this.collect = res.json();
            this.gridOptions.api.setRowData(res.json()) 
            var resultsearch_hide = document.getElementById("resultsearch").style.display='none';
                });
        })
    // $.ajax({
    //         type: 'POST',
    //             data: {
    //                       "hashtag" : hashtag,
    //                       "email" :  email,
    //                       "frcal" : frcal,
    //                       "tocal" : tocal,
    //                       "twitter" : twitter,
    //                      "name"    : name
                        
    //                 },
    //         contentType: 'application/X-www-form-urlencoded',
    //         url: 'http://localhost:4100/dbUserinsert'
    //     });
    

//    http.post 변경전까지 구성요소바꿈 
//   this.searchajax(hashtag,addinfo);
//    console.log("서치 완료")
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
        { headerName: "소셜미디어", field: "sns", sortingOrder: ["asc", "desc"], editable: false, hide: false },
    

        ];
    }
    
  private createColumnDefs2() {
        return [
        { headerName: "hashtag", field: "searchquery", sortingOrder: ["asc", "desc"], editable: false, hide: false, width: 80},
        { headerName: "날짜", field: "date", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "소셜미디어", field: "sns", sortingOrder: ["asc", "desc"], editable: false, hide: false },
        { headerName: "내용", field: "text", sortingOrder: ["asc", "desc"], editable: false, hide: false, width:300 },
        { headerName: "이미지", field: "image", sortingOrder: ["asc", "desc"], editable: false, hide: false, width:300 },
        ];
    }
    


 }
