const express = require('express');
const mongoose = require('mongoose')
const logger = require('morgan');

const url = 'mongodb://localhost/dip_db'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('open', function (){
    console.log('connected to mongodb')
})

const wartimeRouter = require('./routes/wartime');
const milBaseRouter = require('./routes/milBase');
const milWarehouseRouter = require('./routes/milWarehouse');
const milEquipmentRouter = require('./routes/milEquipment');
const logisticsCalculationRouter = require('./routes/logisticsСalculation');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/wartime', wartimeRouter);
app.use('/milbase', milBaseRouter);
app.use('/milwarehouse', milWarehouseRouter);
app.use('/milequipment', milEquipmentRouter);
app.use('/logisticscalculation', logisticsCalculationRouter);

module.exports = app;
