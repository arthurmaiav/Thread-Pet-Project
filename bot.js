console.log('The bot is alive!');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

/*var params = {
    q: 'dogs since:2011-11-11',
    count: 1
};

T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
    var tweets = data.statuses;
    for(var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
    }
};

var tweet = {
    status: '#MyFirstTweet from Node.js'
}

T.post('statuses/update', tweet, tweeted);
*/

//Setting up the stream
var stream = T.stream('statuses/sample');

stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
    var replyTo = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var from = eventMsg.user.screen_name;

    if (replyTo === 'ThreadPet') {
        var newtweet = '@' + from + ' thank you for tweeting me!';
        tweetIt(newtweet);
    }
}

function tweetIt(txt) {
    var tweet = {
        status: txt
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log("deu ruim");
        }
        else {
            console.log("deu bom");
        }
    }
}

