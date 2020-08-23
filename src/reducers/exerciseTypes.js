import ExerciseType from "../data/ExerciseType";

const exerciseTypes = (state = [], action) => {
    switch (action.type) {
        case "ADD EXERCISE TYPES": {
            return action.payload;
        }
        default:
            return state;
    }
}

export default exerciseTypes;