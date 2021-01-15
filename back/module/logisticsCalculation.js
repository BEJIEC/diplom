const Settings = require('../models/settings')
const MilWarehouse = require('../models/milwarehouse')
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});


module.exports.getPriorityForMilBase = async (milBase) => {
    let i = milBase.reason;
    let u = 0;
    let w = milBase.urgency;

    let availability = milBase.availability.reduce((a, b) => a + b.quantity, 0);
    let demand = milBase.mustBeEquipment.reduce((a, b) => a + b.quantity, 0);

    if (availability < demand) {
        if (availability > (demand * 0.75))
            u = 1;
        else if (availability > (demand * 0.5))
            u = 2;
        else if (availability > (demand * 0.25))
            u = 3;
        else
            u = 4
    }
    else
        return 0;

    let p = Math.ceil((i + (u + w) / 2) / 2);
    let settings = await Settings.findOne();
    if (milBase.type === "combat") {
        if (settings.wartime) {
            if (p < 4)
                p += 1;
        } else {
            if (p > 1)
                p -= 1;
        }
    } else {
        if (settings.wartime) {
            if (p > 1)
                p -= 1;

        } else {
            if (p < 4)
                p += 1;
        }
    }

    return p;
}

async function getMinDuration(origin, destination) {
    let response = await client.directions({
        params: {
            origin: origin,
            destination: destination,
            key: "AIzaSyCrlTaY8NMKpZnX95mgnxzvq2xd137Y1UM",
        },
        timeout: 1000,
    })
    return {value: response.data.routes[0].legs[0].duration.value, text: response.data.routes[0].legs[0].duration.text};
}

function lackEquipment(mustBeEquipment, availability) {
    let computed = mustBeEquipment.map(mustBeUnit => {
        let sameUnit = availability.find(availableUnit => availableUnit.id === mustBeUnit.id);
        return {
            id: mustBeUnit.id,
            name: mustBeUnit.name,
            quantity: mustBeUnit.quantity - sameUnit.quantity
        }
    });
    return computed.filter(unit => unit.quantity !== 0);
}

function isSuitable(lackEquipments, equipmentsOnMilWarehouses) {
    for (let lackEquipment of lackEquipments) {
        if (equipmentsOnMilWarehouses.find(equipment => equipment.id === lackEquipment.id)) {
            return true;
        }
    }
    return false;
}

module.exports.getCongruentMilWarehouses = async (milBase) => {
    let availability = milBase.availability;
    let demand = milBase.mustBeEquipment;
    let lackEquipments = lackEquipment(demand, availability)

    let milWarehouses = await MilWarehouse.find();
    let suitableMilWarehouse = [];
    for (let i = 0; i < milWarehouses.length; i++) {
        if (isSuitable(lackEquipments, milWarehouses[i].availability)) {
            let duration = await getMinDuration(milBase.region, milWarehouses[i].region);
            suitableMilWarehouse.push({
                id: milWarehouses[i].id,
                name: milWarehouses[i].name,
                duration: duration,
                availability: milWarehouses[i].availability
            });
        }
    }
    suitableMilWarehouse.sort((a, b) => (a.duration > b.duration) ? 1 : ((b.duration > a.duration) ? -1 : 0));
    return suitableMilWarehouse;
}