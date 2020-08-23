function loadTimer() {
    const timer = localStorage.getItem('timer');
    if (timer) {
        return JSON.parse(timer);
    }
}

function saveTimer(timer) {
    if (timer) {
        localStorage.setItem('timer', JSON.stringify(timer));
    }
    return timer;
}

const timer = (state = loadTimer() || { start: null, pause: null }, action) => {
    switch (action.type) {
        case "START": {
            return saveTimer(Object.assign({}, state, { start: Date.now(), pause: null }));
        }
        case "STOP": {
            return saveTimer(Object.assign({}, state, { start: null, pause: null }));
        }
        case "PAUSE": {
            return saveTimer(Object.assign({}, state, { pause: Date.now() }));
        }
        case "CONTINUE": {
            return saveTimer(Object.assign({}, state, { start: state.start + (Date.now() - state.pause), pause: null }));
        }
        case "SKIP FORWARD": {
            if (state.start) {
                return saveTimer(Object.assign({}, state, { start: state.start - action.payload }));
            }
            return saveTimer(Object.assign({}, state, { start: Date.now() - action.payload, pause: Date.now() }));
        }
        case "SKIP TO": {
            return saveTimer(Object.assign({}, state, { start: Date.now() - action.payload, pause: Date.now() }));
        }
        case "RESET": {
            return saveTimer(Object.assign({}, state, { start: null, pause: null }));
        }
        case "SET WORKOUT": {
            return saveTimer(Object.assign({}, state, { start: null, pause: null }));
        }
        default:
            return state;
    }
};

export default timer;