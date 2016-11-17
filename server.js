
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');
var functions = require('./functions');
var dbsearch = require('./dbsearch');
var app = express();
var cluster = require('cluster');
var Scheduler = require('nschedule');
var config = require('./config');
var async = require('async');

var cheerio = require('cheerio');



if (cluster.isMaster) {


  
    var cpuCount = require('os').cpus().length;

   
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

        var scheduler = new Scheduler(1);


            scheduler.add(8000, function(done,res){

            console.log('schedule instagram 진입')  
            //추후 수정 url 값입력받아서 
            var url = 'https://www.instagram.com/explore/tags/%EB%B8%94%EB%9E%99%EB%B2%A0%EB%A6%AC/';

            var Spooky = require('spooky');

            var spooky = new Spooky({

                    casper: {
                          logLevel: 'debug',
                            verbose: false,
                            options: {
                                clientScripts: ['https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js']
                            },
                            viewportSize: {
                                        width: 1440, height: 768
                                    },
                               pageSettings: {
                                webSecurityEnabled: false,  // (http://casperjs.readthedocs.org/en/latest/faq.html#i-m-having-hard-times-downloading-files-using-download)
                                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11" // Spoof being Chrome on a Mac (https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx)
                            }
                            
                    }
                }, function (err) {
                    if (err) {
                        e = new Error('Failed to initialize SpookyJS');
                        e.details = err;
                        throw e;
                    }
                    

                     spooky.start(url);

                    var selectXPath = 'xPath = function(expression) { return {    type: "xpath", path: expression, toString: function() {return this.type + " selector: " + this.path; }  };};'
                    var instagram = function ()
                    {                         
                           spooky.then(function(){
                            this.scrollToBottom();
                            this.wait(1000);
                            var newScrolleds = this.evaluate(function() {
                                    return window.scrollY;
                                });
                              this.emit('logs',newScrolleds)
                            var newScrolled = this.evaluate(function() {
                                return window.document.body.scrollTop = document.body.scrollHeight;
                                });
                             this.emit('logs',newScrolled)             
  
                        });
                        
                        //더읽기 클릭
                        spooky.then([{x: selectXPath},function() {
                            var xpathExpr1 = '//*[@id="react-root"]/section/main/article/div[2]/div[3]/a';
                            eval(x);
                            this.click(xPath(xpathExpr1));                                        
                            
                        }]);
                        
                        //첫번째그림 대기
                        spooky.waitForSelector('#react-root > section > main > article > div:nth-child(4) > div._nljxa > div:nth-child(6)',function(){
                        });
                        
                        //  첫번째 그림대기후  -> 텍스트내용 전부다 배열로받은값 임시주석
                        //  spooky.then(function(){
                        //     this.scrollToBottom();
                        //     this.wait(1000);    
                        //     text = this.evaluate(function() {
                        //                 var elements = __utils__.findAll('#react-root > section > main > article > div > div > div > a > div > div > img');
                        //                 return elements.map(function(e) {
                        //                     return e.getAttribute('alt');    
                        //                 });
                        //         });

                        //     // this.emit('logs',text)
                        //  });
                       
                        //첫번째그림 클릭
                          spooky.then([{x: selectXPath},function() {
                            var xpathExpr1 = '//*[@id="react-root"]/section/main/article/div[2]/div[1]/div[1]/a[1]';
                            eval(x);
                            this.click(xPath(xpathExpr1));                                        
                            
                        }]);
                        
                        //유저아이디값
                          spooky.waitForSelector('body > div:nth-child(9)',function(){
                                 userid = this.evaluate(function() {
                                        var elements = __utils__.findAll('body > div:nth-child(9) > div > div._g1ax7 > div > article > header > div > a');
                                        return elements.map(function(e) {
                                            return e.getAttribute('title');    
                                        });  
                                });
                                
                                this.emit('logs',userid)
                                this.wait(1000);    
                                this.capture('insta'+new Date()+'.jpg');
                                
                                
                        });

                        //넥스트 버튼 대기
                         spooky.waitForSelector('body > div:nth-child(9) > div > div._quk42 > div > div > a._de018.coreSpriteRightPaginationArrow',function(){     

                        });

                        //넥스트 버튼 클릭 
                        spooky.then([{x: selectXPath},function() {
                        var xpathExpr1 = '/html/body/div[2]/div/div[1]/div/div/a[2]';
                        eval(x);
                        this.click(xPath(xpathExpr1));                     
                        this.wait(1000);                                     
                        }]);

                        //넥스트 후 
                        spooky.then(function() {      
                                 userid = this.evaluate(function() {
                                        var elements = __utils__.findAll('body > div:nth-child(9) > div > div._g1ax7 > div > article > header > div > a');
                                        return elements.map(function(e) {
                                            return e.getAttribute('title');    
                                        });  
                                });
                            this.emit('logs',userid)
                             this.capture('insta'+new Date()+'.jpg');
                        });

                      

                    }

            
                    instagram()
                    
                    
                    spooky.run();
                
                
                });

             spooky.on('logs', function (logs) {
                                console.log(logs);
                            });
            // 스케쥴완성되면 풀자
            // done();
     });


        
         scheduler.add(8000, function(done,res){
            console.log('twitter 진입')  
            var url = 'https://twitter.com/search?f=tweets&vertical=default&q=%23%EC%95%84%EC%9D%B4%ED%8F%B0&src=typd';

            var Spooky = require('spooky');

            var spooky = new Spooky({
                    casper: {
                          logLevel: 'debug',
                            verbose: false,
                            options: {
                                clientScripts: ['https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js']
                            },
                            viewportSize: {
                                        width: 1440, height: 768
                                    },
                               pageSettings: {
                                webSecurityEnabled: false,  // (http://casperjs.readthedocs.org/en/latest/faq.html#i-m-having-hard-times-downloading-files-using-download)
                                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11" // Spoof being Chrome on a Mac (https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx)
                            }
                            
                    }
                }, function (err) {
                    if (err) {
                        e = new Error('Failed to initialize SpookyJS');
                        e.details = err;
                        throw e;
                    }

             
                spooky.start(url);

                 var twitter = function() {
                            spooky.then(function(){
                            this.scrollToBottom();
                            this.wait(1000);
                            // this.emit('logs','1번쨰') 
                            var newScrolleds = this.evaluate(function() {
                                    return window.scrollY;
                                });

                            var newScrolled = this.evaluate(function() {
                                return window.document.body.scrollTop = document.body.scrollHeight;
                                });
                                    
                        });
                        spooky.then(function(){       
                        
                            this.scrollToBottom();
                            this.wait(1000);
                            var newScrolleds = this.evaluate(function() {
                                    return window.scrollY;
                                });
                                
                                this.emit('logs',newScrolleds)
                            var newScrolled = this.evaluate(function() {
                                return window.document.body.scrollTop = document.body.scrollHeight;
                                });
                                    this.emit('logs',newScrolled)
                            // this.capture('twitter'+new Date()+'.jpg');
                            
                        });  
                        spooky.then(function(){
                        
                            Userid = this.evaluate(function() {
                                                var elements = __utils__.findAll('#stream-items-id > li > div > div > div > a > span.username.js-action-profile-name');
                                                return elements.map(function(e) {
                                                    return e.innerText
                                                });
                                        });
                            text = this.evaluate(function() {
                                var elements = __utils__.findAll('#stream-items-id > li > div > div > div > p.TweetTextSize.js-tweet-text.tweet-text');
                                                return elements.map(function(e) {
                                                    return e.innerText                                              
                                                });
                                });
                            //이미지 사용자에 맞게 추후  2016-11-15
                            image = this.evaluate(function() {
                            var elements = __utils__.findAll('#stream-items-id > li > div > div > div > div > div > div.AdaptiveMedia-photoContainer.js-adaptive-photo img');
                                        return elements.map(function(e) {
                                            return e.getAttribute('src');                                          
                                        });
                            });
                            
                        
                                
                            this.emit('logs','유저수 ' + Userid.length)
                            this.emit('logs','본문  ' + text.length)
                            this.emit('logs','그림  ' + image.length)

                        });
                    }

                    //for 문 추후 수정
                    for (var i = 0 ; i<2; i++)
                    {
                      twitter();
                    }

                    spooky.run();
                             
                });


            spooky.on('error', function (e, stack) {
                console.error(e);

                if (stack) {
                    console.log(stack);
                }
            });

            spooky.on('display', function (text) {
                console.log(text);
            });

            spooky.on('log', function (log) {
                if (log.space === 'remote') {
                    console.log(log.message.replace(/ \- .*/, ''));
                }
            });

             spooky.on('logs', function (logs) {
                                console.log(logs);
                            });


        });


}
else
{
        app.use(bodyParser.json({limit: '50mb'}));
        // app.use(bodyParser.urlencoded({extended: true,parameterLimit: 10000,limit: 1024 * 1024 * 10}));
        app.use(bodyParser.urlencoded({
                extended: true,
            parameterLimit: 10000,
            limit: 1024 * 1024 * 10
        }));
        app.use(cors());

        app.post('/authorize', functions.authorize);
        app.post('/search', functions.search);
        app.post('/user', functions.user);
        app.post('/collectSearch', functions.collectSearch);
        app.post('/collectSearchHttp', functions.Schedulesearch);
        app.post('/dbinsert',dbsearch.hashtagins);  //hashtag result insert
        app.post('/dbUserinsert',dbsearch.Userinsert);  //hashtag result insert
        app.post('/dbsearch',dbsearch.getAllCollect);
        app.post('/searchid',dbsearch.searchid);
        app.use(express.static(__dirname));
        app.listen(process.env.PORT || 4100);
        console.log("Server up on port 4100");
        console.log('Worker %d running!', cluster.worker.id);

}

            // 트위터 api 이용
            // 2016-11-12 500개 서치
            // dbsearch.scheduleHash();   
            // functions.scheduleauthorize();

            // setTimeout(function() {
            
            //             async.waterfall([
            //                                 function(callback){
            //                                 console.log("since_id")
            //                                 functions.user()
            //                                 // for(var i = 0 ; i< 2; i++) //수정해야됨
            //                                 // {
            //                                 //     functions.Schedulesearch(i);//0번째 since_id 가져오기                                            
            //                                 // }
            //                                 // setTimeout(function() {
            //                                 //     callback(null,config.schedule.since_id)
            //                                 // }, 3000);
                                            
                                             
            //                                 },
            //                                 function(scheduleId,callback){                                                                                                                                                                                                               
            //                                      console.log("next_result 1")
            //                                      console.log(scheduleId)
            //                                     functions.ScheduleFeatch(scheduleId);
            //                                       setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 },
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 2")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                 ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 3")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                 ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 4")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                  ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 5")
            //                                      console.log(scheduleId)
            //                                      //next_result 없을때 값처리해야됨
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
                                           
            //                                 ]
            //                             );

            //     console.log('종료')
            // }, 3000); 

            // done();

            //     11-13 cheerio 사용안해서 임시 블록 처리 
            //     request(url, function(error, response, body){
            //         if (error) {throw error};


            //        var $ = cheerio.load(body);
           
                
            //         // 11-12 트위터 이름 
            //         $('div.stream-item-header').children('a').children('span').next('span').each(function(i, element){
            //             var namefr = $(this).children('s').eq(0).text();
            //             var nameto = $(this).children('b').eq(0).text();
            //             var name = namefr+nameto;
            //             config.arrcrawTwitter.name[i] = name;
            //         })

            //         // 이미지 순서 수정 필 
            //         $('div.js-tweet-text-container').next('div').children('div').children('div').children('div').children('img').each(function(i, element){
            //             var src = $(this).attr('src')
            //             config.arrcrawTwitter.img[i] = src
            //             // console.log($(this).attr('src'))    //attribs 가져오는거
            //         })      
                  
            //         // 11-12 트위터 내용
            //         $('div.js-tweet-text-container').children('p').each(function(i, element){
            //             var a = $(this).text();
            //             config.arrcrawTwitter.text[i]= a;
            //         })           
               
            //         //끝나는 부분에 object 값 넣어주기
            //         for(var i = 0 ; i < config.arrcrawTwitter.text.length ;  i++)
            //         {
            //             var objcrawlTwitt = new Object()
            //             objcrawlTwitt.name = config.arrcrawTwitter.name[i]
            //             objcrawlTwitt.image = config.arrcrawTwitter.img[i] 
            //             objcrawlTwitt.text = config.arrcrawTwitter.text[i]
            //             config.sumTwitt.push(objcrawlTwitt)

            //         }
            //         // console.log(config.sumTwitt.length)
                  
            //     }  

            // );    