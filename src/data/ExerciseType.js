import generateID from "../util/generateID";

export default class ExerciseType {
    constructor({ id, name, equipment = [], muscles = [], tags = [], tempo = 1, sideSwitch } = {}) {
        this.id = id || generateID();
        this.name = name;
        this.equipment = equipment;
        this.muscles = muscles;
        this.tempo = tempo;
        this.tags = tags;
        this.sideSwitch = sideSwitch;
    }
}