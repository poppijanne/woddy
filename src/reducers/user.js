import User from "../data/User";

const user = (state = null, action) => {
    switch (action.type) {
        case "SET USER": {
            return action.payload;
        }
        default:
            return state;
    }
};

export default user;