import Cirquit from "./Cirquit";
import generateID from "../util/generateID";

class Workout {
    constructor({ id, title, author, info, isPublic, createdTs, modifiedTs, tags, version, cirquits, countDown } = {}) {
        this.id = id || generateID();
        this.createdTs = createdTs;
        this.modifiedTs = modifiedTs;
        this.version = version;
        this.title = title || "Treeni " + new Date().toLocaleDateString("fi-FI");
        this.author = author;
        this.isPublic = isPublic !== undefined ? isPublic : true;
        this.info = info;
        this.tags = tags || [];
        this.cirquits = cirquits?.map(cirquit => new Cirquit(cirquit)) || [];//[new Cirquit()];
        this.countDown = countDown || 10;
    }

    get duration() {
        let duration = this.countDown;
        if (this.cirquits.length > 0) {
            this.cirquits.forEach(cirquit => duration += cirquit.duration);
            duration -= this.cirquits[this.cirquits.length - 1].rest;
        }
        return duration;
    }

    get exerciseNames() {
        const exerciseNames = new Set([]);
        this.cirquits.forEach(cirquit => cirquit.exercises.forEach(exercise => exerciseNames.add(exercise.name)));
        return [...exerciseNames];
    }

    copyCirquit(cirquitId) {
        const index = this.cirquits.findIndex(cirquit => cirquit.id === cirquitId);
        if (index !== -1) {
            const cirquit = this.cirquits[index].copy();
            this.cirquits.splice(index + 1, 0, cirquit);
        }
    }

    deleteCirquit(cirquitId) {
        const index = this.cirquits.findIndex(cirquit => cirquit.id === cirquitId);
        this.cirquits.splice(index, 1);
    }

    moveCirquitUp(cirquitId) {
        const index = this.cirquits.findIndex(cirquit => cirquit.id === cirquitId);
        if (index > 0) {
            const cirquit = this.cirquits.splice(index, 1)[0];
            this.cirquits.splice(index - 1, 0, cirquit);
        }
    }

    moveCirquitDown(cirquitId) {
        const index = this.cirquits.findIndex(cirquit => cirquit.id === cirquitId);
        if (index < this.cirquits.length - 1) {
            const cirquit = this.cirquits.splice(index, 1)[0];
            this.cirquits.splice(index + 1, 0, cirquit);
        }
    }

    getCirquitStartTime(cirquitId) {

        let time = this.countDown;
        for (let i = 0; i < this.cirquits.length; i++) {

            const cirquit = this.cirquits[i];

            if (cirquit.id === cirquitId) {
                break;
            }

            for (let repeat = 1; repeat <= cirquit.repeats; repeat++) {
                // eslint-disable-next-line no-loop-func
                cirquit.exercises.forEach((exercise, index, exercises) => {
                    time += exercise.duration;
                    if (index < exercises.length - 1 || repeat < cirquit.repeats) {
                        time += exercise.rest;
                    }
                });
            }
            time += cirquit.rest;
        }

        return time;
    }

    getStatus(secondsFromStart) {

        if (this._status?.secondsFromStart === secondsFromStart) {
            return this._status;
        }

        const status = {
            secondsFromStart,
            duration: 0,
            countDownDone: secondsFromStart >= this.countDown,
            done: false,
            previousCirquit: undefined,
            currentCirquit: undefined,
            currentCirquitIndex: undefined,
            currentRound: 1,
            previousExercise: undefined,
            currentExercise: undefined,
            currentExerciseIndex: undefined,
            nextExercise: undefined,
            resting: false,
            cirquitRest: false,
            cirquitDone: false,
            remainingCountDownTime: 0,
            remainingRestTime: 0,
            remainingExerciseTime: 0,
            remainingCirquitTime: 0,
            executedCirquitTime: 0,
        }

        let time = this.countDown;

        if (secondsFromStart < this.countDown) {
            status.remainingCountDownTime = this.countDown - secondsFromStart;
            status.nextExercise = this.cirquits[0]?.exercises[0];
            status.currentExerciseIndex = 0;
            status.currentCirquit = this.cirquits[0];
            status.currentCirquitIndex = 0;
            this._status = status;
            return status;
        }

        let previousCirquit;

        this.cirquits.forEach((cirquit, cirquitIndex) => {
            
            const cirquitStartTime = time;

            for (let repeat = 1; repeat <= cirquit.repeats; repeat++) {

                // eslint-disable-next-line no-loop-func
                cirquit.exercises.forEach((exercise, index, exercises) => {

                    if (status.currentExercise && !status.nextExercise) {
                        status.nextExercise = exercise;
                    }

                    if (!status.currentExercise) {
                        if (secondsFromStart >= time && secondsFromStart < time + exercise.duration) {
                            status.currentExercise = exercise;
                            status.currentExerciseIndex = index;
                            status.remainingExerciseTime = time + exercise.duration - secondsFromStart;
                            status.resting = false;
                            status.remainingRestTime = exercise.rest;
                            status.currentCirquit = cirquit;
                            status.currentCirquitIndex = cirquitIndex;
                            status.previousCirquit = previousCirquit;
                            status.currentRound = repeat;
                            status.executedCirquitTime = secondsFromStart - cirquitStartTime;
                            status.remainingCirquitTime = cirquit.duration - status.executedCirquitTime;
                        }
                        else if (index < exercises.length - 1 || repeat < cirquit.repeats) {
                            if (secondsFromStart >= time && secondsFromStart < time + exercise.duration + exercise.rest) {
                                status.currentExercise = exercise;
                                status.currentExerciseIndex = index;
                                status.remainingExerciseTime = 0;
                                status.resting = true;
                                status.remainingRestTime = time + exercise.duration + exercise.rest - secondsFromStart;
                                status.currentCirquit = cirquit;
                                status.currentCirquitIndex = cirquitIndex;
                                status.previousCirquit = previousCirquit;
                                status.currentRound = repeat;
                                status.executedCirquitTime = secondsFromStart - cirquitStartTime;
                                status.remainingCirquitTime = cirquit.duration - status.executedCirquitTime;
                            }
                        }
                    }

                    if (!status.currentExercise && status.countDownDone && !status.cirquitDone) {
                        status.previousExercise = exercise;
                    }

                    time += exercise.duration;

                    if (index < exercises.length - 1 || repeat < cirquit.repeats) {
                        time += exercise.rest;
                    }
                });
            }

            if (secondsFromStart >= time && secondsFromStart < time + cirquit.rest) {

                status.cirquitDone = true;
                status.previousExercise = this.cirquits[cirquitIndex].exercises[this.cirquits[cirquitIndex].exercises.length - 1];

                if (cirquitIndex < this.cirquits.length - 1) {
                    status.resting = true;
                    status.cirquitRest = true;
                    status.remainingRestTime = time + cirquit.rest - secondsFromStart;
                    status.currentCirquit = this.cirquits[cirquitIndex + 1];
                    status.currentCirquitIndex = cirquitIndex + 1;
                    status.previousCirquit = previousCirquit;
                    status.nextExercise = this.cirquits[cirquitIndex + 1].exercises[0];
                    status.currentExerciseIndex = 0;
                    status.currentRound = 1;
                    status.executedCirquitTime = cirquit.duration;
                    status.remainingCirquitTime = 0;
                }
            }

            if (cirquitIndex < this.cirquits.length - 1) {
                time += cirquit.rest;
            }

            previousCirquit = cirquit;
        })

        status.duration = time;
        const lastCirquit = this.cirquits[this.cirquits.length - 1];
        const lastExercise = lastCirquit?.exercises[lastCirquit?.exercises.length - 1];

        if (status.duration <= secondsFromStart &&
            status.countDownDone &&
            status.previousExercise?.id === lastExercise?.id) {
            status.done = true;
        }

        this._status = status;

        return status;
    }

    findExerciseWithId(id) {
        const cirquit = this.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === id));
        return cirquit.exercises.find(exercise => exercise.id === id);
    }
}

export default Workout;