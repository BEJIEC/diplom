const express = require('express');
const router = express.Router();
const MilWarehouse = require('../models/milwarehouse')

router.get('/', async (req, res) => {
    try {
        let milWarehouse = await MilWarehouse.find();
        res.json(milWarehouse);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let milWarehouse = await MilWarehouse.findOne({'id':req.params.id});
        res.json(milWarehouse);
    } catch (err) {
        res.send("Error: " + err);
    }
});


router.post('/', async (req, res) => {
    try {
        let milWarehouse = new MilWarehouse(req.body)
        let response = await milWarehouse.save();
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        let response = await MilWarehouse.findOneAndUpdate({'id':req.params.id}, req.body);
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let response = await MilWarehouse.findOneAndDelete({'id':req.params.id});
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});


module.exports = router;
