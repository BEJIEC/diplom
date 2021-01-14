import { v4 } from 'uuid';
import { makeAutoObservable } from 'mobx';

export default class PrioritizedBase {

    id;
    name;
    priority;

    constructor({ id, name, priority }) {
        this.id = id || v4();
        this.name = name || '';
        this.priority = priority || 0;

        makeAutoObservable(this);
    }

}