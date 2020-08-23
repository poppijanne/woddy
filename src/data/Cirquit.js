import generateID from "../util/generateID";
import Exercise from "./Exercise"

class Cirquit {
    constructor({ id, exercises = [], repeats = 1, rest = 60 } = {}) {
        this.id = id || generateID("xxxxxxxxxxxxxxxx");
        this.exercises = exercises.map(exercise => new Exercise(exercise));
        this.repeats = repeats;
        this.rest = rest;
    }

    get duration() {
        let duration = this.rest;
        if (this.exercises.length > 0) {
            this.exercises.forEach(exercise => duration += (exercise.duration + exercise.rest) * this.repeats);
            duration -= this.exercises[this.exercises.length - 1].rest;
        }
        return duration;
    }

    get equipment() {
        const equipment = new Set([]);
        this.exercises.forEach(exercise => exercise.equipment.forEach(e => equipment.add(e)));
        return [...equipment];
    }

    copy() {
        const cirquit = new Cirquit();
        cirquit.exercises = this.exercises.map(exercise => exercise.copy());
        cirquit.repeats = this.repeats;
        cirquit.rest = this.rest;
        return cirquit;
    }

    createNewExercise(id) {
        if (this.exercises.length === 0) {
            this.exercises.push(new Exercise({ id }));
        }
        else {
            const lastExercise = this.exercises[this.exercises.length - 1];
            this.exercises.push(new Exercise({ id, duration: lastExercise.duration, rest: lastExercise.rest }));
        }
    }

    copyExercise(exerciseId) {
        const index = this.exercises.findIndex(exercise => exercise.id === exerciseId);
        if (index !== -1) {
            const exercise = new Exercise(this.exercises[index]);
            exercise.id = generateID();
            this.exercises.splice(index, 0, exercise);
        }
    }

    deleteExercise(exerciseId) {
        const index = this.exercises.findIndex(exercise => exercise.id === exerciseId);
        //if (index !== -1 && this.exercises.length > 1) {
        this.exercises.splice(index, 1);
        //}
    }

    moveExerciseUp(exerciseId) {
        const index = this.exercises.findIndex(exercise => exercise.id === exerciseId);
        if (index > 0) {
            const exercise = this.exercises.splice(index, 1)[0];
            this.exercises.splice(index - 1, 0, exercise);
        }
    }

    moveExerciseDown(exerciseId) {
        const index = this.exercises.findIndex(exercise => exercise.id === exerciseId);
        if (index < this.exercises.length - 1) {
            const exercise = this.exercises.splice(index, 1)[0];
            this.exercises.splice(index + 1, 0, exercise);
        }
    }
}

export default Cirquit;