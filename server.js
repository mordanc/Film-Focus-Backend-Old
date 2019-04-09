var constants = require('./constants');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MovieInfo = require('./schema');

const port = 3001;
const server = require('http').createServer().listen(port);
const io = require('socket.io')(server);

// connect to database
mongoose.connect(constants.DATABASEURL, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.on('open', () => {
    console.log('Connected to database');
});



io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('saveToDb', ({ id, video_id_array }) => {
        console.log("Requested: " + id + ', Videos: ' + video_id_array);

        MovieInfo.findOne({ movie_id: id }, (err, result) => {

            if (err) return console.error(err);
            else {
                try {
                    console.log('Found matching record for : ' + result.movie_id);
                }
                catch (error) {
                    console.log('Movie does not exist in database, creating record...');
                    var movie = new MovieInfo({ movie_id: id, video_id_array: video_id_array });
                    movie.save((err, res) => {
                        if (err) return console.error(err);
                        console.log('Saved record' + id + ' to database');
                        socket.emit('Response', res);
                    });
                }
            }
        });
    });

    socket.on('requestVideos', id => {
        MovieInfo.findOne({ movie_id: id }, function (err, result) {
            console.log('Looking for ' + id)
            if (err) return console.log(err);

            console.log("Found results " + result);
            return result;

        })
    })
})