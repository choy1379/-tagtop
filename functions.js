var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');
var synrequest = require('sync-request');


functions = {
 
    authorize: function(req, res) {
        var header = config.consumerkey + ':' +config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;
        
        request.post('https://api.twitter.com/oauth2/token', {form: {'grant_type': 'client_credentials'}, 
        headers: {Authorization: finalheader}}, function(error, response, body) {
            if(error)
            console.log(error);
            else {
                config.bearertoken = JSON.parse(body).access_token;
                
                res.json({success: true, data:config.bearertoken});
            }
            
        })
    },
     search: function(req, res) {
        console.log(req.body);
        
        var searchquery = req.body.query;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
         '&result_type=recent&count=100&include_entities=true&since_id=0', {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
             
                res.json({success: true, data:JSON.parse(body.body)});
                
             }
         })
      
        
    },
     collectSearch: function(req, res) {
         //addinfo value save
        config.addinfo = req.body.query.addinfo;
        console.log(config.addinfo)
        var since_id = req.body.query.since_id;
  
        var searchquery = req.body.query.hashtag;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        if(since_id == 0)
        {
            request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
            '&result_type=recent&count=100&include_entities=true&since_id=' + since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log();
                else {
    
                    config.sumarray = JSON.parse(body.body).statuses

                    for(var i= 0 ; i< config.sumarray.length ; i++)
                    {   
                       var dt = new Date(Date.parse(config.sumarray[i].created_at.replace(/( \+)/, ' UTC$1')))
                       var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                       config.sumarray[i].created_at = ConvertDt

                    }
                    if(config.sumarray.length < 100)
                    {
                        res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
                    }
                        res.json({success: true, data:JSON.parse(body.body),searchquery,addinfo:config.addinfo});                
                }
            })
        }
        else
        {
        request.get('https://api.twitter.com/1.1/search/tweets.json?q='+encsearchquery+'&count=100&include_entities=1&result_type=recent&max_id='+since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log(error);
                else {

                         for(var i = 0 ; i < JSON.parse(body.body).statuses.length; i++)
                        {
                            config.sumarray[config.sumarray.length] = JSON.parse(body.body).statuses[i]
                            var dt = new Date(Date.parse(config.sumarray[config.sumarray.length-1].created_at.replace(/( \+)/, ' UTC$1')))
                            var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                            
                            config.sumarray[config.sumarray.length-1].created_at = ConvertDt
            
                        }

                        console.log(config.sumarray.length)

                        if(config.sumarray.length ==500)
                        {  
                            res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
                        }
                        else
                        {
                            if(config.sumarray.length == 100 || config.sumarray.length == 200 || config.sumarray.length == 300 || config.sumarray.length == 400 || config.sumarray.length == 500)
                            {
                                res.json({success: true, data:JSON.parse(body.body),searchquery,addinfo:config.addinfo});
                            }
                            else if (config.sumarray.length > 100)
                            { 
                                res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});                      
                            }
                            else
                            {
                                res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});                      
                            }
                        }
                    }

            })
        }
    },
    Schedulesearch : function(count)
    {
        console.log(count)
        if(config.schedule.since_id.length == 0)
        {
             var since_id = 0;
        }
      
        var searchquery = config.schedule.hashtag[count];   //첫번쨰
        console.log(searchquery)
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;

       
         request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
            '&result_type=recent&count=100&include_entities=true&since_id=' + since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log()
                else {      
                      switch (count) {
                        case 4    : config.schedule.since_id[0] = JSON.parse(body.body).search_metadata.next_results 
                                    console.log('4번')
                                    console.log(config.schedule.since_id[0])
                                    break;
                        case 3   : config.schedule.since_id[1] = JSON.parse(body.body).search_metadata.next_results
                                   console.log('3번')
                                   console.log(config.schedule.since_id[1])
                                    break;
                        case 2  : config.schedule.since_id[2] = JSON.parse(body.body).search_metadata.next_results
                                    console.log('2번')
                                  console.log(config.schedule.since_id[2])
                                    break;
                        case 1   : config.schedule.since_id[3] = JSON.parse(body.body).search_metadata.next_results
                                    console.log('1번')
                                   console.log(config.schedule.since_id[3])
                                    break;
                        case 0  : config.schedule.since_id[4] = JSON.parse(body.body).search_metadata.next_results
                                     console.log('0번')
                                  console.log(config.schedule.since_id[4])
                                    break
                        default    : console.log('case문 종료');
                                    break;
                        }
                }
            })
       
        
     
    
    },
    user: function(){

         var searchquery = config.schedule.hashtag[0];   //첫번쨰
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://stream.twitter.com/1.1/statuses/filter.json?track='+encsearchquery, {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
                 console.log(body.body)
                 console.log(response)
             }
         })
    },
       scheduleauthorize: function() {
        var header = config.consumerkey + ':' +config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;
        
        request.post('https://api.twitter.com/oauth2/token', {form: {'grant_type': 'client_credentials'}, 
        headers: {Authorization: finalheader}}, function(error, response, body) {
            if(error)
            console.log(error);
            else {
             config.bearertoken = JSON.parse(body).access_token;
             console.log("권한 완료")
            }
            
        })
    },
    ScheduleFeatch : function(scheduleId)
    {  
        console.log('fetch 진입완료')

        for(var k = 3 ; k < scheduleId.length; k++) //2개 5 - 2  수정해야됨
        {

         var bearerheader = 'Bearer ' + config.bearertoken;
       
                 request.get('https://api.twitter.com/1.1/search/tweets.json'+scheduleId[k], {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log();
                else {
                    
                            for(var i = 0 ; i < JSON.parse(body.body).statuses.length; i++)
                                {
                                    config.sumarray[config.sumarray.length] = JSON.parse(body.body).statuses[i]
                                    var dt = new Date(Date.parse(config.sumarray[config.sumarray.length].created_at.replace(/( \+)/, ' UTC$1')))                              
                                    // var dt = new Date(Date.parse(config.sumarray[config.sumarray.length-1].created_at.replace(/( \+)/, ' UTC$1')))
                                    var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()  
                                    config.sumarray[config.sumarray.length].created_at = ConvertDt
                                    // config.sumarray[config.sumarray.length-1].created_at = ConvertDt  
                                }
                            for(var i = 0 ; i<scheduleId.length; i++)
                            {   
                                if(scheduleId[i] == undefined)  //차후 수정 어차피 5개 풀되면 지워도됨 if 문 
                                {

                                }
                                else
                                {
                                    if(JSON.stringify(scheduleId[i]).slice(9,27)==JSON.parse(body.body).search_metadata.max_id_str)
                                    {
                                        switch (i) {
                                                    case 0    : config.schedule.since_id[0] = JSON.parse(body.body).search_metadata.next_results 
                                                                console.log('4번')
                                                                console.log(JSON.parse(body.body).search_metadata)
                                                            
                                                                break;
                                                    case 1   : config.schedule.since_id[1] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('3번')
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                           
                                                                break;
                                                    case 2  : config.schedule.since_id[2] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('2번')
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                          
                                                                break;
                                                    case 3   : config.schedule.since_id[3] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('1번')
                                                            console.log(JSON.parse(body.body).statuses[0].text)
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                            
                                                                break;
                                                    case 4  : config.schedule.since_id[4] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('0번')
                                                            console.log(JSON.parse(body.body).statuses[0].text)
                                                              console.log(JSON.parse(body.body).search_metadata)
                                                           
                                                                break
                                                    default    : console.log('Fetch case문 종료');
                                                                break;
                                                    }
                                    }
                            }
                        }
                                        
                }
            })
  
     
 
        }
    
    },
    scheduleinstagram: function(count) {

            console.log('schedule instagram 진입')  
            console.log(count)
            var searchquery = config.schedule.hashtag[count];   
            var id = config.schedule.name[count];
            var encsearchquery = encodeURIComponent(searchquery);
            var url = 'https://www.instagram.com/explore/tags/' + encsearchquery;
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
                                webSecurityEnabled: false,  
                                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11" 
                            }
                            
                    }
                }, function (err) {
                    if (err) {
                        e = new Error('Failed to initialize SpookyJS');
                        e.details = err;
                        throw e;
                    }
                    

                     spooky.start(url);
                     var config = require('./config');
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
                        
                        //첫번째그림 클릭
                          spooky.then([{x: selectXPath},function() {
                            var xpathExpr1 = '//*[@id="react-root"]/section/main/article/div[2]/div[1]/div[1]/a[1]';
                            eval(x);
                            this.click(xPath(xpathExpr1));                                        
                            
                        }]);
                        
                        //유저아이디값
                          spooky.waitForSelector('body > div:nth-child(9)',[{searchquery: searchquery,id:id},function(){
                                userid = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > header > div > a').getAttribute('title');                                   
                                });
                                date = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > a > time').getAttribute('datetime');                                   
                                });
                                image = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div:nth-child(2) > div > div._jjzlb > img').getAttribute('src');                                   
                                });
                                like = this.evaluate(function() {
                                        // return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > div > span > span').innerText;                                   
                                        var elements =__utils__.findAll('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > div > a');
                                        return elements.map(function(e) {
                                                return  e.getAttribute('title');                                            
                                            });    
                                });
                                text = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > ul > li:nth-child(1) > h1 > span').innerText;                                   
                                });

                               
                               
                                instagram = new Object() 
                                instagram.userid = userid;
                                instagram.date = date
                                instagram.image = image
                                instagram.like = like.length
                                instagram.sns = 'instagram'
                                instagram.text = text
                                instagram.searchquery = searchquery
                                instagram.id = id 
                                this.emit('dbinsert',instagram)
                                this.wait(1000);    
                                // this.capture('insta'+new Date()+'.jpg');
                                
                                
                        }]);

                        //넥스트 버튼 대기
                            spooky.waitForSelector('body > div:nth-child(9) > div > div._g1ax7 > div > article > div:nth-child(2) > div > div._jjzlb > img',function(){
                        });
                        
                        //for문 개수만큼 수정
                        for(var i =0; i<10; i++)
                        {
                        //넥스트 버튼 클릭 
                        spooky.then([{x: selectXPath},function() {
                        var xpathExpr1 = '/html/body/div[2]/div/div[1]/div/div/a[2]';
                        eval(x);
                        this.click(xPath(xpathExpr1));                     
                        this.wait(1000);                                  
                        }]);

                        //넥스트 후 
                        spooky.then([{searchquery: searchquery,id:id},function() {      
                           userid = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > header > div > a').getAttribute('title');                                   
                                });
                                date = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > a > time').getAttribute('datetime');                                   
                                });
                                image = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div:nth-child(2) > div > div._jjzlb > img').getAttribute('src');                                   
                                });
                                like = this.evaluate(function() {
  
                                        var elements =__utils__.findAll('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > div > a');
                                        return elements.map(function(e) {
                                                return  e.getAttribute('title');                                            
                                            });
                                });

                                instagram = new Object() 

                                if(like.length == 0)
                                {
                                     like = this.evaluate(function() {
                                              return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > section._tfkbw._d39wz > div > span > span').innerText;
                                     })
                                     instagram.like = like
                                }
                                else
                                {
                                     instagram.like = like.length
                                }

                                text = this.evaluate(function() {
                                        return __utils__.findOne('body > div:nth-child(9) > div > div._g1ax7 > div > article > div._es1du._rgrbt > ul > li:nth-child(1) > h1 > span').innerText;                                   
                                });

                               
                              
                                instagram.userid = userid
                                instagram.date = date
                                instagram.image = image
                                instagram.sns = 'instagram'
                                instagram.text = text
                                instagram.searchquery = searchquery
                                instagram.id = id 
                                this.emit('dbinsert',instagram)

                        }]);    
                        }     

                    }

                    instagram()
                    
                    spooky.run();
                
                
                });

             spooky.on('logs', function (logs) {
                            console.log(logs);
                            });

             spooky.on('dbinsert', function (instagram) {
                  var dt = new Date(Date.parse(instagram.date.replace(/( \+)/, ' UTC$1')))                              
                  var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                  instagram.date = ConvertDt
                  console.log(instagram)

                    // //디비 입력
                      db.dummy.save(instagram, function(){
                        });
                      
                });
                        
    },
     scheduletwitter: function(count) {
           console.log('twitter 진입')  
           console.log(count)
            var searchquery = config.schedule.hashtag[count];   
            var id = config.schedule.name[count];
            var encsearchquery = encodeURIComponent(searchquery);
            var url = 'https://twitter.com/search?f=tweets&vertical=default&q=%23'+encsearchquery+'&src=typd';

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
                                webSecurityEnabled: false, 
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
                    
                    }
                
                  var twitterins = function()
                  {
                          spooky.then([{searchquery: searchquery,id:id},function(){
                        
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
                            
                            image = this.evaluate(function() {
                                                var elements = __utils__.findAll('#stream-items-id > li > div > div > div > div > div > div.AdaptiveMedia-photoContainer.js-adaptive-photo img');
                                                            return elements.map(function(e) {
                                                                return e.getAttribute('src');                                          
                                                            });
                                                });

                           date = this.evaluate(function() {
                                                // var elements = __utils__.findAll('#stream-items-id > li > div > div > div > small > a');
                                                //             return elements.map(function(e) {
                                                //                 return e.getAttribute('title');                                          
                                                //             });
                                                    var elements = __utils__.findAll('#stream-items-id > li > div > div > div > small > a > span._timestamp.js-short-timestamp');
                                                        return elements.map(function(e) {
                                                            return e.getAttribute('data-time-ms');                                          
                                                        });
                                        
                                                });
                  
            
                            for(var i = 0; i<Userid.length; i++)
                            {
                                data = new Object() 
                                data.Userid = Userid[i]
                                data.text = text[i]
                                data.image = image[i]
                                data.date = date[i]
                                data.sns = 'twitter'
                                data.searchquery = searchquery
                                data.id = id 
                                this.emit('dbinsert', data)
                            }
                                
                                //  this.emit('dbinsert', Userid.length)
                        
                        }]);
                  }

                    // i값 추후 수정해줘야됨 개수에 따라  2016/11/24
                    for (var i = 0 ; i<3; i++)
                    {
                            //마지막 insert
                        if( i == 2)
                        {
                            twitterins()
                        }
                        else  //for문 만큼 Bottom
                        {
                             twitter()
                        }

                    }

                    spooky.run();
                             
                });
            spooky.on('logs', function (logs) {
                                        console.log(logs);
                                        });

             spooky.on('dbinsert', function (data) {
                    var dt = new Date(Number(data.date))
                    var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                    data.date = ConvertDt
             
                    //디비 입력
                      db.dummy.save(data, function(){
                        });
                });


     }

}


module.exports = functions;


                        //  첫번째 그림대기후  -> 텍스트내용 전부다 배열로받은값 주석
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
                       