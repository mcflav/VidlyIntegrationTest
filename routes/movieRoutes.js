const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Movie, validate} = require('../models/moviesModel');
const {Genre} = require('../models/genresModel');
const auth = require('../middleware/auth');

//router.get('/', async (req,res) => {
//    const movies = await Movie.find();
//    res.send(movie);
//});
//
//router.get('/:id', async (req,res) => {
//    const movie = await Movie.findById(req.params.id);
//    
//    if (!movie) return res.status(404).send("This id cannot be found.");
//    
//    res.send(movie);
//});
//
router.post('/', auth, async (req,res) => {
   const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
});

//router.put('/:id', async (req,res) => {
//    //const { error } = validate(req.body);
//    //if (error) return res.status(400).send(error.details[0].message);
//        
//    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body);
//    
//    if (!movie) return res.status(404).send("This id cannot be found.");
//    
//    res.send(movie);
//});
//
//router.delete('/:id', async (req,res) => {
//    const movie = await Movie.findByIdAndRemove(req.params.id);
//    
//    if (!movie) return res.status(404).send("This id cannot be found.");
//    
//    res.send(movie);
//});
//

//async function addGenre(movieId, genre){
//  const movie = await Movie
//  .findById(movieId);
//  movie.genres.push(genre);
//  movie.save();
//  console.log(genre);
//}
//
//addGenre('5f69913d99b1b85458847d6a', new Genre({name: 'Classic'}));

module.exports = router;











