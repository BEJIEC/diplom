import { v4 } from 'uuid';
import { makeAutoObservable, toJS } from 'mobx';

import MilEquipment from './MilEquipment';

export const MilBase_types = {
    combat: 'combat',
    studying: 'studying'
}

export const Reason_Array = [
    'Немає важливості',
    'Роздподіл ресурсів',
    'Виконання планових задач',
    'Виконання позапланових задач',
    'Людські життя',
];

export const Urgency_Array = [
    'Коли буде зручно',
    'Нетерміново і неважливо',
    'Нетерміново і важливо',
    'Терміново і неважливо',
    'Терміново і важливо',
];

export default class MilBase {

    id;
    name;
    type;
    reason; // i
    urgency; // w
    mustBeEquipment;
    availability;
    region;
    marker;

    constructor({ id, name, type, reason, urgency, mustBeEquipment, availability, region, marker = null } = {}) {
        this.id = id || v4();
        this.name = name || '';
        this.type = type || MilBase_types.studying;
        this.reason = reason || 0;
        this.urgency = urgency || 0;
        this.mustBeEquipment = (mustBeEquipment && [...mustBeEquipment?.map(mustBeEquipment => new MilEquipment(mustBeEquipment))]) || [];
        this.availability = (availability && [...availability?.map(availability => new MilEquipment(availability))]) || [];
        this.region = region || {
            lat: 0,
            lng: 0
        };
        this.marker = marker;

        makeAutoObservable(this);
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

    toServerContract() {
        let serverFormat = toJS(this);
        delete serverFormat.marker;
        return serverFormat;
    }

    static createEmptyMilWarehouse() {
        return new this();
    }

}