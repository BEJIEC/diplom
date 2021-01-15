const mongoose = require('mongoose')


const MilBaseSchema = new mongoose.Schema({
    id : String,
    name: String,
    type: String,
    reason: Number,
    urgency: Number,
    mustBeEquipment: [{
        id : String,
        name: String,
        quantity: Number
    }],
    availability: [{
        id : String,
        name: String,
        quantity: Number
    }],
    region: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('MilBase', MilBaseSchema);