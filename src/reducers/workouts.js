const workouts = (state = [], action) => {
    switch (action.type) {
        case "SET WORKOUT SUMMARIES": {
            return action.payload;
        }
        case "ADD WORKOUT TO SUMMARY": {
            const workout = state.find(summary => summary.workoutId === action.payload.id);
            if (workout) {
                workout.workout = action.payload;
                return [...state];
            }
            else {
                console.error("Could not find summary for workout " + action.payload.id);
                return state;
            }
        }
        default:
            return state;
    }
};

export default workouts;