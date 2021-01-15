const mongoose = require('mongoose')


const MilWarehouseSchema = new mongoose.Schema({
    id: String,
    name: String,
    availability: [{
        id: String,
        name: String,
        quantity: Number
    }],
    region: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('MilWarehouse', MilWarehouseSchema);