// ******** Variables**************
nodeArgs = process.argv;
command = process.argv[2];
var songName = "";
var movieName = "";

// ******* Twitter Command **********
function tweets() {
	var keys = require('./keys.js');

	var Twitter = require('twitter');

	var client = new Twitter ({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	})

	client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=rix6code&count=20', function(error, tweets, response) {
	  	if (error) {
	  		console.log(error);
	  	} else {
	  		console.log("*******************************");
	  		console.log("-------My Last 20 Tweets-------");
	  		console.log("*******************************");
			for (var i = 0; i < tweets.length; i++) {
				console.log("-------------------------");
				console.log("Created on " + tweets[i].created_at);
				console.log(tweets[i].text);
				console.log("-------------------------");
			}
	  	}
	});
}

// ********* OMDB Command **********	
function movie() {
	var request = require('request');
	// var movieName = "";

	// for loop for movie name including multiple word movies
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
		movieName = movieName + "+" + nodeArgs[i];
		} else {
			movieName += nodeArgs[i]; 
		}
	}

	request('http://www.omdbapi.com/?t=' + movieName, function (error, response, body) {
 		if (error) {
 			console.log(error);
 		} else if (movieName === "") {
 		console.log("-------------------------");
		console.log('If you haven\'t watched "Mr. Nobody," then you should: http:www.imdb.com/title/tt0485947/');
		console.log("It's on Netflix!");
		console.log("-------------------------");
		} else {
 		console.log("-------------------------");
 		console.log("Title: " + JSON.parse(body).Title);
 		console.log("Year: " + JSON.parse(body).Year);
 		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
 		console.log("Country: " + JSON.parse(body).Country);
 		console.log("Language: " + JSON.parse(body).Language );
 		console.log("Plot: " + JSON.parse(body).Plot);
 		console.log("Actors: " + JSON.parse(body).Actors);
 		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
 		console.log("Website URL: " + JSON.parse(body).Website);
 		console.log("-------------------------");
 		}
	});	
}

// *********** Spotify Command ******************
function song() {
	var spotify = require('spotify');
	// var songName = "";

	// for loop for song name including multiple word songs
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
			songName = songName + "+" + nodeArgs[i];
		} else {
			songName += nodeArgs[i]; 
		}
	}

	// if no song is provided look up "The Sign" by Ace of Base
	if (songName === "") {
		spotify.lookup({ type: 'track', id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
			if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
	        } else {
	    	console.log("-------------------------");
	 		console.log("Artist(s): " + data.artists[0].name);
	 		console.log("Song Name: " + data.name);
	 		console.log("Spotify Preview Link: " + data.preview_url);
	 		console.log("From the album: " + data.album.name);
	 		console.log("-------------------------");
	 		}	
		});
	// if song is provided 
	} else {
		spotify.search({ type: 'track', query: songName, }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		   	} else {
		 	console.log("-------------------------");
		 	console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
		 	console.log("Song Name: " + data.tracks.items[0].name);
		 	console.log("Spotify Preview Link: " + data.tracks.items[0].preview_url);
		 	console.log("This song is from the album: " + data.tracks.items[0].album.name);
		 	console.log("-------------------------");
		 	}
		});
	}
}
	
// ******** do-what-it-says Command **************
function readText() {
 	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(error, data) {
  	
  	var dataArr = data.split(",");

		// console.log(dataArr[0]);
	    // console.log(dataArr[1]);
	  	
	  	if (dataArr[0] === "spotify-this-song") {
		  	songName = dataArr[1];
		  	song();
	  	} else if (dataArr[0] === "movie-this") {
	  		movieName = dataArr[1];
	  		movie();
	  	} else if (dataArr[0] === "my-tweets") {
	  		tweets();
	  	}
  	});
}

if (command === "spotify-this-song") {
	song();
} else if (command === "my-tweets") {
	tweets();
} else if (command === "movie-this") {
	movie();
} else if (command === "do-what-it-says") {
	readText();
}
