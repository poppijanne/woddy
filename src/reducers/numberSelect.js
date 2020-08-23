const numberSelect = (state = { show: false }, action) => {
    switch (action.type) {
        case "OPEN NUMBER SELECT": {
            return {
                show: true,
                values: action.payload.values,
                settings: action.payload.settings,
                actionGenerator: action.payload.actionGenerator
            };
        }
        case "CLOSE NUMBER SELECT": {
            return {
                show: false
            };
        }
        default:
            return state;
    }
}

export default numberSelect;