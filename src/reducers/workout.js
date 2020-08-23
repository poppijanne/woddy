import Workout from "../data/Workout";
import ExerciseType from "../data/ExerciseType";
import generateID from "../util/generateID";
import Exercise from "../data/Exercise";
import Cirquit from "../data/Cirquit";

function loadWorkout() {
    const workout = localStorage.getItem('workout');
    if (workout) {
        return new Workout(JSON.parse(workout));
    }
}

function storeWorkout(workout) {
    if (workout) {
        localStorage.setItem('workout', JSON.stringify(workout));
    }
    return workout;
}

const workout = (state = loadWorkout() || new Workout(), action) => {
    switch (action.type) {
        case "SET WORKOUT": {
            return storeWorkout(action.payload);
        }
        case "SET WORKOUT TITLE": {
            state.title = action.payload.title;
            return storeWorkout(new Workout(state));
        }
        case "SET WORKOUT AUTHOR": {
            state.author = action.payload.author;
            return storeWorkout(new Workout(state));
        }
        case "SET WORKOUT INFO": {
            state.info = action.payload.info;
            return storeWorkout(new Workout(state));
        }
        case "SET WORKOUT COUNTDOWN": {
            state.countDown = action.payload.countDown;
            return storeWorkout(new Workout(state));
        }
        case "ADD CIRQUIT": {
            state.cirquits.splice(action.payload.index, 0, action.payload.cirquit);
            return storeWorkout(new Workout(state));
        }
        case "CREATE NEW CIRQUIT": {
            state.cirquits.splice(action.payload.index, 0, new Cirquit());
            return storeWorkout(new Workout(state));
        }
        case "MOVE CIRQUIT UP": {
            state.moveCirquitUp(action.payload.cirquitId)
            return storeWorkout(new Workout(state));
        }
        case "MOVE CIRQUIT DOWN": {
            state.moveCirquitDown(action.payload.cirquitId)
            return storeWorkout(new Workout(state));
        }
        case "DELETE CIRQUIT": {
            state.deleteCirquit(action.payload.cirquitId)
            return storeWorkout(new Workout(state));
        }
        case "COPY CIRQUIT": {
            state.copyCirquit(action.payload.cirquitId)
            return storeWorkout(new Workout(state));
        }
        case "ADD NEW EXERCISE": {
            const cirquit = state.cirquits.find(cirquit => cirquit.id === action.payload.cirquitId);
            cirquit.exercises.push(action.payload.exercise);
            return storeWorkout(new Workout(state));
        }
        case "CREATE NEW EXERCISE": {
            const cirquit = state.cirquits.find(cirquit => cirquit.id === action.payload.cirquitId);
            cirquit.createNewExercise(action.payload.exerciseId);
            return storeWorkout(new Workout(state));
        }
        case "SET CIRQUIT REPEATS": {
            const cirquit = state.cirquits.find(cirquit => cirquit.id === action.payload.cirquitId);
            cirquit.repeats = action.payload.repeats;
            return storeWorkout(new Workout(state));
        }
        case "SET CIRQUIT REST": {
            const cirquit = state.cirquits.find(cirquit => cirquit.id === action.payload.cirquitId);
            cirquit.rest = action.payload.rest;
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE DURATION": {
            const exercise = state.findExerciseWithId(action.payload.exerciseId);
            exercise.duration = action.payload.duration;
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE REST": {
            const exercise = state.findExerciseWithId(action.payload.exerciseId);
            exercise.rest = action.payload.rest;
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE TYPE": {
            const exercise = state.findExerciseWithId(action.payload.exerciseId);
            exercise.setType(action.payload.type);
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE NAME": {
            const exercise = state.findExerciseWithId(action.payload.exerciseId);
            exercise.name = action.payload.name;
            return storeWorkout(new Workout(state));
        }
        case "DELETE EXERCISE": {
            const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === action.payload.exerciseId));
            cirquit.deleteExercise(action.payload.exerciseId);
            return storeWorkout(new Workout(state));
        }
        case "COPY EXERCISE": {
            const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === action.payload.exerciseId));
            cirquit.copyExercise(action.payload.exerciseId);
            return storeWorkout(new Workout(state));
        }
        case "MOVE EXERCISE UP": {
            const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === action.payload.exerciseId));
            cirquit.moveExerciseUp(action.payload.exerciseId);
            return storeWorkout(new Workout(state));
        }
        case "MOVE EXERCISE DOWN": {
            const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === action.payload.exerciseId));
            cirquit.moveExerciseDown(action.payload.exerciseId);
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE DURATIONS": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const exercise = state.findExerciseWithId(exerciseId);
                exercise.duration = action.payload.duration;
            });
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE RESTS": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const exercise = state.findExerciseWithId(exerciseId);
                exercise.rest = action.payload.rest;
            });
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE TYPES": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const exercise = state.findExerciseWithId(exerciseId);
                exercise.setType(action.payload.type);
            });
            return storeWorkout(new Workout(state));
        }
        case "SET EXERCISE NAMES": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const exercise = state.findExerciseWithId(exerciseId);
                exercise.name = action.payload.name;
            });
            return storeWorkout(new Workout(state));
        }
        case "DELETE EXERCISES": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === exerciseId));
                cirquit.deleteExercise(exerciseId);
            });
            return storeWorkout(new Workout(state));
        }
        case "COPY EXERCISES": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === exerciseId));
                cirquit.copyExercise(exerciseId);
            });
            return storeWorkout(new Workout(state));
        }
        case "MOVE EXERCISES UP": {
            action.payload.exerciseIds.forEach(exerciseId => {
                const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === exerciseId));
                cirquit.moveExerciseUp(exerciseId);
            });
            return storeWorkout(new Workout(state));
        }
        case "MOVE EXERCISES DOWN": {
            action.payload.exerciseIds.reverse().forEach(exerciseId => {
                const cirquit = state.cirquits.find(cirquit => cirquit.exercises.find(exercise => exercise.id === exerciseId));
                cirquit.moveExerciseDown(exerciseId);
            });
            return storeWorkout(new Workout(state));
        }
        default:
            return state;
    }
};

export default workout;