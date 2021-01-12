import { makeAutoObservable } from 'mobx';

export default class MilEquipment {

    id;
    name;
    quantity;

    constructor({ id, name, quantity } = {}) {
        makeAutoObservable(this);

        this.id = id || null;
        this.name = name || '';
        this.quantity = quantity || 0;
    }

    static createEmptyMilEquipment() {
        return new this();
    }

}