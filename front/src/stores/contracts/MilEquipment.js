import { v4 } from 'uuid';
import { makeAutoObservable, toJS } from 'mobx';

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

    toServerContract() {
        return toJS(this);
    }

    static createEmptyMilEquipment() {
        return new this();
    }

}