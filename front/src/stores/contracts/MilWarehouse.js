import { makeAutoObservable } from 'mobx';

import MilEquipment from './MilEquipment';

export default class MilWarehouse {

    id;
    name;
    availability;
    region;

    constructor({ id, name, availability, region } = {}) {
        makeAutoObservable(this);

        this.id = id || null;
        this.name = name;
        this.availability = availability?.map(availability => new MilEquipment(availability)) || [MilEquipment.createEmptyMilEquipment()];
        this.region = region || {
            lat: 0,
            lng: 0
        };
    }

    static createEmptyMilWarehouse() {
        return new this();
    }

}