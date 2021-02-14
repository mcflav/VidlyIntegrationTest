const mongoose = require('mongoose');
const express = require('express');
const {Genre, validate} = require('../models/genresModel');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

//Using express-async-errors
router.get('/', async (req,res) => {
    //throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req,res) => {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) return res.status(404).send("This Id could not be found.");
    res.send(genre);
});

router.post('/', auth, async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let genre = new Genre(req.body);
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id',[auth, validateObjectId], async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    
    if (!genre) return res.status(404).send("This Id could not be found.");
    
    res.send(genre);
})

//Not Using express-async-errors

//router.get('/', asyncMiddleware(async (req,res) => {
//    const genres = await Genre.find().sort('name');
//    res.send(genres);
//}));
//
//router.post('/', auth, asyncMiddleware(async (req,res) => {
//    const {error} = validate(req.body);
//    if (error) return res.status(400).send(error.details[0].message);
//    
//    let genre = new Genre(req.body);
//    genre = await genre.save();
//    res.send(genre);
//}));

router.delete('/:id',[auth, admin, validateObjectId], async(req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);
})

module.exports = router;
