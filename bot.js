console.log('The bot is starting');
var Twit = require('twit');
var config = require('./config');
const fs = require('fs'); // part of Node, no npm install needed  
const path = require('path'); // part of Node, no npm install needed
var T = new Twit(config);
var ids = [];

function addUser(id_str) {
	ids.push(id_str);
}

function checkUser(id_str){
	var inArray = false;

	for(i=0; i<ids.length; i++){
		if(ids_str == ids[i]) {
			inArray = true;
		}
	}
	if(inArray === false){
		addUser(id_str);
		return true; //Pode tweetar
	}
	return false; //Não pode tweetar
}

function postTweet(txt){

	var b64content = [fs.readFileSync('img/1.jpg', { encoding: 'base64' }),
					  fs.readFileSync('img/2.jpg', { encoding: 'base64' }),
					  fs.readFileSync('img/3.jpg', { encoding: 'base64' })]

	var index = Math.floor(Math.random() * b64content.length);

	// first we must post the media to Twitter
	T.post('media/upload', { media_data: b64content[index] }, function (err, data, response) {
	// now we can assign alt text to the media, for use by screen readers and
	// other text-based presentations and interpreters
	var mediaIdStr = data.media_id_string
	var altText = "Small flowers in a planter on a sunny balcony, blossoming."
	var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

	T.post('media/metadata/create', meta_params, function (err, data, response) {
		if (!err) {
		// now we can reference the media and post a tweet (media will attach to the tweet)
		var params = { status: txt, media_ids: [mediaIdStr] }

		T.post('statuses/update', params, function (err, data, response) {
			console.log(data)
		})
		}
	})
	})
}

function getTweet(){
	var getParams = {
		q: '#createpet', 
		count: 3
	}

	T.get('search/tweets', getParams, gotData);

	function gotData(err, data, response) {
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length ; i++) {

			//Aponta pro post que deve ser monitorado
			if(tweets[i].in_reply_to_status_id_str == "1126562665994825729") {
				//Coloca tweet em Lower Case
				var tweetL = tweets[i].text.toLowerCase();
				//Tweet possui a hashtag
				if(tweetL.includes(getParams.q)) {
					//Usuario esta no array?
					if(checkUser(tweets[i].user.id_str)) {
						//Template do tweet do pet
						var tweet = "Salve @" + tweets[i].user.screen_name + " ta ai teu cusco";
						postTweet(tweet);					
					}
				}	
			}
		}
	}
}

getTweet();
