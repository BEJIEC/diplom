import { makeAutoObservable } from 'mobx';

export default class Settings {

    isWarState;
    equipmentsBase; // [{ id, name }]

    constructor({ isWarState = false, equipmentsBase } = {}) {
        this.isWarState = isWarState;
        this.equipmentsBase = equipmentsBase || [];
    }

}