const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const {User, validate} = require('../models/usersModel');
const auth = require('../middleware/auth');
const router = express.Router();
const _ = require('lodash');

router.get('/me', auth, async(req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/', async(req,res) => {
    const users = await User.find();
    res.send(users);
})

router.post('/', async (req,res) => {
    // If name, email, or password are not valid values throw 400 error.
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //Make sure the user is not already registered.
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
