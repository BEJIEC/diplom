const mongoose = require('mongoose')


const MilEquipmentSchema = new mongoose.Schema({
    id: String,
    name: String
});

module.exports = mongoose.model('MilEquipment', MilEquipmentSchema);