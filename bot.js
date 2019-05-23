console.log('The bot is starting');
var Twit = require('twit');
var config = require('./config');
const fs = require('fs');  
const path = require('path');
var T = new Twit(config);
var ids = [];

var b64content = [fs.readFileSync('img/1.jpg', { encoding: 'base64' }),
				  fs.readFileSync('img/2.jpg', { encoding: 'base64' }),
				  fs.readFileSync('img/3.jpg', { encoding: 'base64' })]

function addUser(id_str) {
	ids.push(id_str);
}

function checkUser(id_str){
	var inArray = false;

	for(i=0; i<ids.length; i++){
		if(id_str == ids[i]) {
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
	var index = Math.floor(Math.random() * b64content.length);
	T.post('media/upload', { media_data: b64content[index] }, function (err, data, response) {
	var mediaIdStr = data.media_id_string
	var altText = "Small flowers in a planter on a sunny balcony, blossoming."
	var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

	T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
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
		q: '#adoptpet',
		q2: 'name',
		q3: 'specie',
		count: 1
	}

	T.get('search/tweets', getParams, gotData);

	function gotData(err, data, response) {
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length ; i++) {
			//Aponta pro tweet que deve ser monitorado
			if(tweets[i].in_reply_to_status_id_str == "1130522891634847745") {
				//Coloca tweet em Lower Case
				var tweetLowerCase = tweets[i].text.toLowerCase();
				//Tweet possui parametros?
				if(tweetLowerCase.includes(getParams.q, getParams.q2, getParams.q3)) {
					//Usuario esta no array?
					if(checkUser(tweets[i].user.id_str)) {
						var splittedTweet = tweets[i].text.split('"');
						var petName = splittedTweet[1];
						var petSpecie = splittedTweet[3];
						//Template do tweet do pet
						var tweet = "Name: " + petName + "\n" +
									"Specie: " + petSpecie + "\n" +
									"Owner: @" + tweets[i].user.screen_name;
						postTweet(tweet);					
					}
				}	
			}
		}
	}
}

setInterval(getTweet, 10000);
