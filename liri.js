// environment request 

require("dotenv").config();

// Adding the code required to import the keys.js file and store it in a variable.

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');

// //Required Spotify API & Keys

var spotify = new Spotify(keys.spotify);

// default Movie 

var defaultMovie = "Mr. Nobody";

// file system

var fs = require('fs');

// Input Argument

var command = process.argv[2];
var input = process.argv[3]; //song or movie input

//Switch Case

switch (command) {
    case "concert-this":
        getBands(input);
        break;
    case "spotify-this-song":
        getSongs(input);
        break;
    case "movie-this":
        if (Value == "") {
            Value = defaultMovie;
        }
        getMovies(input)
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Wrong command! Please try again.");
        break;
}

// concert-this
function getBands(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            console.log("Name of the venue:", response.data[0].venue.name);
            console.log("Venue location:", response.data[0].venue.city);
            var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log("Date of the Event:", eventDate);
        })
        .catch(function(error) {
            console.log(error);
        });
}


// spotify-this-song
function getSongs(song) {

    //If user has not specified a song
    if (song === "") {
        song = "That's What I Like";
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //Artist(s)
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
            // Preview 
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
            // The album of the song 
        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

// movie-this

function getMovies(Movie) {

    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + Movie)
        .then(function(data) {
            // console.log(data.data); 
            var results = `
        Title of the movie: ${data.data.Title}
        Year the movie came out: ${data.data.Year}
        IMDB Rating of the movie: ${data.data.Rated}
        Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
        Country where the movie was produced: ${data.data.Country}
        Language of the movie: ${data.data.Language}
        Plot of the movie: ${data.data.Plot}
        Actors in the movie: ${data.data.Actors}`;
            console.log(results)

        })
        .catch(function(error) {
            console.log(error);
        });

    //Response if user does not type in a movie title
    if (Movie === "Mr. Nobody") {
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };
}
// do-what-it-says
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify') {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === 'omdb') {
                omdbThis(dataArr[1]);
            }
        }
    });
}