import generateID from "../util/generateID";

class Exercise {
    constructor({ id, name = "", duration = 0, rest = 0, repeats = 0 } = {}) {
        this.id = id || generateID("xxxxxxxxxxxxxxx");
        this.name = name || "";
        this.repeats = repeats;
        this.duration = duration || 0;
        this.rest = rest || 0;
    }

    setType(type) {
        this.name = type.name;
    }

    copy() {
        const exercise = new Exercise();
        exercise.name = this.name;
        exercise.repeats = this.repeats;
        exercise.duration = this.duration;
        exercise.rest = this.rest;
        return exercise;
    }
}

export default Exercise;