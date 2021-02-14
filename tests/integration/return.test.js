const {Rental} = require('../../models/rentalsModel');
const {User} = require('../../models/usersModel');
const {Movie} = require('../../models/moviesModel');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/v1/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;
    let dateReturned;
    
    const exec = () => {
        return request(server)
       .post('/api/v1/returns')
       .set('x-auth-token', token)
       .send({customerId, movieId, dateReturned});
    };
    
   beforeEach(async () => {
        server = require('../../index');
                
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        
        movie = new Movie({
         _id: movieId,
         title: '12345',
         genres: {name: '12345'},
         numberInStock: 10,
         dailyRentalRate: 2
        });
        
        await movie.save();
        
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'The Mack',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    
    it('should return 401 if client is not logged in.', async () => {
        token = '';
        
        const res = await exec();
        
        expect(res.status).toBe(401);
    });
    
    it('should return 400 if customerId is not provided.', async () => {
       customerId = '';
       
       const res = await exec();
       
       expect(res.status).toBe(400);
    });
    
    it('should return 400 if movieId is not provided.', async () => {
       movieId = '';
       
       const res = await exec();
       
       expect(res.status).toBe(400);
    });
    
    it('should return 404 if movieId and customerId are not found.', async () => {
        await Rental.remove({});
        
        //const res = await execGet();
         
        const res = await exec();
              
        expect(res.status).toBe(404);
    });
    
    it('should return 400 if return is already processed.', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();
              
        expect(res.status).toBe(400);
    });
    
    it('should return 200 if valid request.', async () => {
        
        const res = await exec();
              
        expect(res.status).toBe(200);
    });
    
    it('set the Return Date if input is valid.', async () => {
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    
    it('calculate the rental fee.', async () => {
        
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    
    it('increase the movie stock.', async () => {
        const res = await exec();
        
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    
    it('Return the rental in the body of the response.', async () => {
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        //expect(res.body).toHaveProperty('dateOut');
        //expect(res.body).toHaveProperty('dateReturned');
        //expect(res.body).toHaveProperty('rentalFee');
        //expect(res.body).toHaveProperty('customer');
        //expect(res.body).toHaveProperty('movie');
        
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned','rentalFee', 'customer', 'movie'])
        )
    });
});