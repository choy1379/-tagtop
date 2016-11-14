
var Spooky = require('spooky');

var ITUNES_URL = 'https://itunes.apple.com';

console.log();
console.log("*******************************************************");
console.log();
console.log("To find the ratings for an iTunes application, use the following:");
console.log("   node app.js <URL>")
console.log();
console.log("For example: ");
console.log("   node app.js 'https://itunes.apple.com/us/app/facebook/id284882215?mt=8&v0=' ");
console.log();
console.log("*******************************************************");
console.log("");

var url = process.argv[2];
if(typeof(url) === 'undefined'){
	
	console.error("No url to fetch, please check the example above.");
	process.exit();
}

console.log("The url to be fetched is: '"+url+"'");
if(url.length < ITUNES_URL.length || url.slice(0, ITUNES_URL.length) !== ITUNES_URL){
    console.error('Sorry, only itunes supported...');
    process.exit();
}


var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(url);

	spooky.then(function(){
	    // save a screenshot of the page, yeah it's Christmas soon!
	    this.capture('itune'+new Date()+'.png');
	});

	spooky.waitFor(function check() {
	    return this.evaluate(function() {
		return document.querySelectorAll('.customer-ratings').length > 0;
	    });
	}, function then() {

	    var result = this.evaluate(function(toto) {
		    var ratingsElt = document.getElementsByClassName('customer-ratings')[0];
		    //var currentVersionRating = ratingsElt.getElementsByClassName('rating')[0].getAttribute('aria-label').charAt(0);

	 	    var allVersionRating = ratingsElt.getElementsByClassName('rating')[1].getAttribute('aria-label').charAt(0);
		    var allVersionCount = ratingsElt.getElementsByClassName('rating-count')[1].textContent;

		    var regexpOnlyNumbers = new RegExp("[0-9]+","g");
		    var resultCount = allVersionCount.match(regexpOnlyNumbers)[0];
		    var result = {};
		    result.allVersionRating = allVersionRating;
		    result.resultCount = resultCount;

                    return result;
 	  
	   });
	   this.emit('display', 'star rating: '+result.allVersionRating);
	   this.emit('display', 'star rating count: '+result.resultCount);

	  
	   
	}, function timeout() { // step to execute if check has failed
	    this.echo("Sorry, it took to much time to fetch the rating, try later or check if the url is correct.").exit();
	});

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






// var links = [];
// var casper = require('casper').create({
//     pageSettings: {
//         loadImages: true,//The script is much faster when this field is set to false
//         loadPlugins: true,
//         userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36' 
//  },
//     // verbose: true, logLevel: "debug"  
// });
// casper.options.viewportSize = {width: 1024, height: 768}



// casper.start('https://twitter.com/search?f=tweets&vertical=default&q=%23%EC%95%84%EC%9D%B4%ED%8F%B0&src=typd', function() {
// 	var fileLocate = 'screenShotTest/1.jpg';
//     this.captureSelector(fileLocate, "html");
// 	this.fill('form#global-nav-search', { 'q': '#블랙베리' }, true);

// });

// casper.then(function() {
// 	this.fill('form#global-nav-search[action="/search"]', { 'q': '#블랙베리' }, true);
// });

// casper.then(function(){

// 	var latestComment = function(){
//         // return document.querySelectorAll('ol[id="stream-items-id"] li div div div a')[1].innerText;
// 		 return document.querySelector('#stream-items-id li').innerText;
//         // return document.querySelector("div.stream-item-header").querySelectorAll("span")[0].innerText //내용
//         // return document.querySelector("#stream-item-tweet-797398173236875265 > div > div.content > div.stream-item-header > a > span.username.js-action-profile-name").innerText //내용

//     };
  
//     console.log(this.evaluate(latestComment));
 

   
// });


// casper.run(function() {  
//     var fileLocate = 'screenShotTest/2.jpg';
// 	this.captureSelector(fileLocate, "html");
//     console.log('완료')
// });

