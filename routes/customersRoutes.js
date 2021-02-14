const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customersModel');

router.get('/', async (req,res) => {
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id', async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) return res.status(404).send("This id cannot be found.");
    
    res.send(customer);
})

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        
    let customer = new Customer(req.body);
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
    
    if (!customer) return res.status(404).send("This id cannot be found.");
    
    res.send(customer);
})

router.delete('/:id', async (req,res) => {
    const customer = await findByIdAndRemove(req.params.id);
    
    if (!customer) return res.status(404).send("This id cannot be found.");
    
    res.send(customer);
})

module.exports = router;