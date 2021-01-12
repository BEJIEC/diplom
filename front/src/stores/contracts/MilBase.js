import { makeAutoObservable } from 'mobx';

import MilEquipment from './MilEquipment';

export const MilBase_types = {
    combat: 'combat',
    studying: 'studying'
}

export default class MilBase {

    id;
    name;
    type;
    mustBeEquipment;
    availability;
    region;

    constructor({ id, name, type, mustBeEquipment, availability, region } = {}) {
        makeAutoObservable(this);

        this.id = id || null;
        this.name = name;
        this.type = type || MilBase_types.studying;
        this.mustBeEquipment = mustBeEquipment?.map(mustBeEquipment => new MilEquipment(mustBeEquipment)) || [MilEquipment.createEmptyMilEquipment()];
        this.availability = availability?.map(availability => new MilEquipment(availability)) || [MilEquipment.createEmptyMilEquipment()];
        this.region = region || {
            lat: 0,
            lng: 0
        };
    }

    get lackEquipment() {
        let computed = this.mustBeEquipment.map(mustBeUnit => {
            let sameUnit = this.availability.find(availableUnit => availableUnit.id === mustBeUnit.id);

            return new MilEquipment({
                id: mustBeUnit.id,
                name: mustBeUnit.name,
                quantity: mustBeUnit.quantity - sameUnit.quantity
            })
        });

        return computed.filter(unit => unit.quantity !== 0);
    }

    static createEmptyMilWarehouse() {
        return new this();
    }

}