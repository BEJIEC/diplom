const express = require('express');
const router = express.Router();
const MilBase = require('../models/milbase')

const getPriorityForMilBase = require('../module/logisticsCalculation').getPriorityForMilBase
const getCongruentMilWarehouses = require('../module/logisticsCalculation').getCongruentMilWarehouses

router.get('/priority', async (req, res) => {
    try {
        let milBases = await MilBase.find();
        let response = [];
        for (let milBase of milBases) {
            response.push({
                id: milBase.id,
                name: milBase.name,
                priority: await getPriorityForMilBase(milBase)
            })
        }
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.get('/supply/:id', async (req, res) => {
    try {
        let milBases = await MilBase.findOne({'id': req.params.id});
        let congruentMilWarehouses = await getCongruentMilWarehouses(milBases);

        res.json(congruentMilWarehouses);
    } catch (err) {
        res.send("Error: " + err);
    }
});

module.exports = router;