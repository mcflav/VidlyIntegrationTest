const express = require('express');
const {Rental} = require('../models/rentalsModel');
const {Movie} = require('../models/moviesModel');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');
const router = express.Router();


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
     
    if (!rental) return res.status(404).send('movieId and customerId not found.');
    
    if (rental.dateReturned) return res.status(400).send('Return already processed.');
    
    rental.return();
    await rental.save();
    
     await Movie.update({_id: rental.movie._id},{
        $inc: {numberInStock: 1}
    });
   return res.send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectid().required(),
        movieId: Joi.objectid().required()
    };
    
    return Joi.validate(req, schema);
}

//router.get('/:id', async (req,res) => {
//   const rental = await Rental.findById(req.params.id);
//   if (!rental) return res.status(404).send('movieId and customerId not found.');
//});

module.exports = router;