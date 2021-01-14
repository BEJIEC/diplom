import { v4 } from 'uuid';
import { makeAutoObservable } from 'mobx';

export default class Settings {

    isWarState;
    equipmentsBase; // [{ id, name }]

    constructor({ isWarState = false, equipmentsBase } = {}) {
        this.isWarState = isWarState;
        this.equipmentsBase = (equipmentsBase && [...equipmentsBase]) || [];

        makeAutoObservable(this);
    }

    addEquipment(equipment) {
        if (!equipment.id) equipment.id = v4();
        this.equipmentsBase.push(equipment);
    }

    removeEquipment(id) {
        this.equipmentsBase = this.equipmentsBase.filter(unit => unit.id !== id)
    }

}