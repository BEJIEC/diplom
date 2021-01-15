const express = require('express');
const router = express.Router();
const Settings = require('../models/settings')

router.get('/', async (req, res) => {
    try {
        let setting = await Settings.findOne();
        if (setting === null){
            let newSetting = new Settings({wartime:false});
            let response = await newSetting.save();
            res.json(response);
            return;
        }
        res.json(setting);
    } catch (err) {
        res.send("Error: " + err);
    }
});

router.patch('/', async (req, res) => {
    try {
        let setting = await Settings.findOne();
        setting.wartime = req.body.wartime;
        let response = await setting.save();
        res.json(response);
    } catch (err) {
        res.send("Error: " + err);
    }
});

module.exports = router;