export default class PrioritizedBase {

    id;
    name;
    priority;

    constructor({ id, name, priority }) {
        this.id = id;
        this.name = name;
        this.priority = priority;
    }

}