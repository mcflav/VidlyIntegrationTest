const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 155
    },
});
//const Genre = mongoose.model('Genre', genreSchema);

const movieSchema = new mongoose.Schema({
    title: String,
    genres: [genreSchema],    
    numberInStock: {
        type: Number,
        required: true,
        min: 2,
        max: 225
    },
    dailyRentalRate: {
        type: Number,
        min: 2,
        max: 255
    },
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(2).max(255).required(),
        genres: Joi.objectid().required(),
        numberInStock: Joi.string().min(2).max(255).required(),
        dailyRentalRate: Joi.string().min(5).max(255).required(),
    };
    
    return Joi.validate(movie,schema);
}

exports.Movie = Movie;
//exports.Genre = Genre;
exports.validate = validateMovie;