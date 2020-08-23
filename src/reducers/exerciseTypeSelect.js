const exerciseTypeSelect = (state = { show: false, exerciseIds: [] }, action) => {
    switch (action.type) {
        case "OPEN EXERCISE TYPE SELECT": {
            return {
                show: true,
                exerciseIds: action.payload.exerciseIds
            };
        }
        case "CLOSE EXERCISE TYPE SELECT": {
            return {
                show: false,
                exerciseIds: []
            };
        }
        default:
            return state;
    }
}

export default exerciseTypeSelect;