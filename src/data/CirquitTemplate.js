import generateID from "../util/generateID";

export default class CirquitTemplate {
    constructor({ id, name, exercises = [], repeats = 1, rest = 60 } = {}) {
        this.id = id || generateID();
        this.name = name;
        this.exercises = exercises;
        this.repeats = repeats;
        this.rest = rest;
    }
}