import { v4 } from 'uuid';
import { makeAutoObservable, toJS } from 'mobx';

import MilEquipment from './MilEquipment';

export default class MilWarehouse {

    id;
    name;
    availability;
    region;
    marker;

    constructor({ id, name, availability, region, marker = false } = {}) {
        this.id = id || v4();
        this.name = name || '';
        this.availability = (availability && [...availability?.map(availability => new MilEquipment(availability))]) || [];
        this.region = region || {
            lat: 0,
            lng: 0
        };
        this.marker = marker;

        makeAutoObservable(this);
    }

    toServerContract() {
        let serverFormat = toJS(this);
        delete serverFormat.marker;
        console.log(serverFormat)
        return serverFormat;
    }

    static createEmptyMilWarehouse() {
        return new this();
    }

}