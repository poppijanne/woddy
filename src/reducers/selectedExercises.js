const exercise = (state = new Set([]), action) => {
    switch (action.type) {
        case "SELECT EXERCISE": {
            state.add(action.payload.exerciseId) 
            return new Set([...state]);
        }
        case "SELECT ONE EXERCISE": {
            return new Set([action.payload.exerciseId]);
        }
        case "UNSELECT EXERCISE": {
            if (state.delete(action.payload.exerciseId)) {
                return new Set([...state]);
            }
            return state;
        }
        case "GLOBAL CLICK": {
            return new Set([]);
        } 
        case "CLOSE SIDE BAR": {
            return new Set([]);
        } 
        default:
            return state;
    }
}

export default exercise;