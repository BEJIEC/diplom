const mongoose = require('mongoose')


const SettingsSchema = new mongoose.Schema({
    wartime: {type: Boolean, default: false}
});

module.exports = mongoose.model('Settings', SettingsSchema);