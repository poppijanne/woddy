export default function cirquitTemplateSelect(state = { show: false, index: 0 }, action) {
    switch (action.type) {
        case "OPEN CIRQUIT TEMPLATE SELECT": {
            return {
                show: true,
                index: action.payload.index,
                callback: action.payload.callback
            };
        }
        case "CLOSE CIRQUIT TEMPLATE SELECT": {
            return {
                show: false,
                index: 0
            };
        }
        default:
            return state;
    }
}