import { v4 } from 'uuid';
import { makeAutoObservable } from 'mobx';

export default class MilEquipment {

    id;
    name;
    quantity;

    constructor({ id, name, quantity } = {}) {
        this.id = id || v4();
        this.name = name || '';
        this.quantity = quantity || 0;

        makeAutoObservable(this);
    }

    static createEmptyMilEquipment() {
        return new this();
    }

}