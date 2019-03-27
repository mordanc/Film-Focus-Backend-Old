var mongoose = require('mongoose');

let MovieInfoSchema = new mongoose.Schema({
    movie_id: {type: String, required: true},
    video_id_array: {type: Array},
});

module.exports = mongoose.model('MovieInfo', MovieInfoSchema);