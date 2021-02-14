const genres = require('../routes/genresRoutes');
const movies = require('../routes/movieRoutes');
const rentals = require('../routes/rentalsRoutes');
const customers = require('../routes/customersRoutes');
const register = require('../routes/usersRoutes');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const returns = require('../routes/returns');

const express = require('express');


module.exports = function(app) {
app.use(express.json());
app.use('/api/v1/genres', genres);
app.use('/api/v1/movies', movies);
app.use('/api/v1/rentals', rentals);
app.use('/api/v1/customers', customers);
app.use('/api/v1/users', register);
app.use('/api/v1/auth', auth);
app.use('/api/v1/returns', returns);
app.use(error);
};