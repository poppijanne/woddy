const selectedCirquits = (state = new Set([]), action) => {
    switch (action.type) {
        case "SELECT CIRQUIT": {
            state.add(action.payload.cirquitId) 
            return new Set([...state]);
        }
        case "UNSELECT CIRQUIT": {
            if (state.delete(action.payload.cirquitId)) {
                return new Set([...state]);
            }
            return state;
        }
        case "GLOBAL CLICK": {
            return new Set([]);
        } 
        case "SELECT EXERCISE": {
            return new Set([]);
        } 
        default:
            return state;
    }
}

export default selectedCirquits;