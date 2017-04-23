nodeArgs = process.argv;
command = process.argv[2];
var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');
var fs = require("fs");
var songName = "";
var movieName = "";

// ******* Twitter Command **********
function tweets() {
	var keys = require('./keys.js');

	// since you've already named your twitter keys the same as what the Twitter client expects
	// you can simply pass those in instead of redundantly naming them.
	var client = new Twitter (keys.twitterKeys)

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
				fs.appendFile('./log.txt', tweets[i].text + ", ", function(err) {
					if (err) {
						return console.log(err);
					}
					console.log('Your log.txt updated');
				});
			}
		}
	});
}

// ********* OMDB Command **********	
function movie() {

	// for loop for movie name including multiple word movies
	for (i = 3; i < nodeArgs.length; i++) {
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
		// Instead of repeatedly parsing the body, you can simply redefine the body as it's parsed result
		body = JSON.parse(body)
		// and then you can save yourself a few key strokes and a few computing cycles like so:
 		console.log("-------------------------");
 		console.log("Title: " + body.Title);
 		console.log("Year: " + body.Year);
 		console.log("IMDB Rating: " + body.imdbRating);
 		console.log("Country: " + body.Country);
 		console.log("Language: " + body.Language );
 		console.log("Plot: " + body.Plot);
 		console.log("Actors: " + body.Actors);
 		console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
 		console.log("Website URL: " + body.Website);
 		console.log("-------------------------");
 		}
 		fs.appendFile('./log.txt', body.Title + ", ", function(err) {
					if (err) {
						return console.log(err);
					}
					console.log('Your log.txt updated');
		});
	});	
}

// *********** Spotify Command ******************
function song() {

	// for loop for song name including multiple word songs
	for (i = 3; i < nodeArgs.length; i++) {
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
		spotify.search({ type: 'track', query: '"' + songName + '"' }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		   	} else {
		  // when you find yourself accessing such a deeply nested piece of data
		  // you can go ahead and assign it to a variable for the sake of readability
		  var trackInfo = data.tracks.items[0]
		 	console.log("-------------------------");
		 	console.log("Artist(s): " + trackInfo.album.artists[0].name);
		 	console.log("Song Name: " + trackInfo.name);
		 	console.log("Spotify Preview Link: " + trackInfo.preview_url);
		 	console.log("This song is from the album: " + trackInfo.album.name);
		 	console.log("-------------------------");
		 	}
		 	fs.appendFile('./log.txt', trackInfo.name + ", ", function(err) {
					if (err) {
						return console.log(err);
					}
					console.log('Your log.txt updated');
			});
		});
	}
}
	
// ******** do-what-it-says Command **************
function readText() {

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
