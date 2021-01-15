const express = require('express');
const router = express.Router();
const MilBase = require('../models/milbase')

router.get('/', async (req, res) => {
    try {
        let milBase = await MilBase.find();
        res.json(milBase);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let milBase = await MilBase.findOne({'id': req.params.id});
        res.json(milBase);
    } catch (err) {
        res.send("Error: " + err);
    }
});


router.post('/', async (req, res) => {
    try {
        let milBase = new MilBase(req.body)
        let response = await milBase.save();
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        let response = await MilBase.findOneAndUpdate({'id': req.params.id}, req.body);
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let response = await MilBase.findOneAndDelete({'id': req.params.id});
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});


module.exports = router;
