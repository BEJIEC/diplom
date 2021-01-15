const express = require('express');
const router = express.Router();
const MilEquipment = require('../models/milequipment')

router.get('/', async (req, res) => {
    try {
        let milEquipment = await MilEquipment.find();
        res.json(milEquipment);
    } catch (err) {
        res.send("Error: " + err);
    }
});



router.post('/', async (req, res) => {
    try {
        await MilEquipment.deleteMany();
        for (let equip of req.body) {
            let milEquipment = new MilEquipment(equip)
            await milEquipment.save();
        }
        res.json({type: "OK"});
    } catch (err) {
        res.send("Error: " + err);
    }
});



module.exports = router;
