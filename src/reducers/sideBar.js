const sideBar = (state = { open: false, menu: null }, action) => {
    switch (action.type) {
        case "OPEN SIDE BAR": {
            return {
                open: true,
                menu: null
            }
        }
        case "OPEN SIDE BAR MENU": {
            return {
                open: true,
                menu: action.payload
            }
        }
        case "CLOSE SIDE BAR": {
            return {
                open: false,
                menu: false
            }
        }
        case "CLOSE SIDE BAR MENU": {
            return {
                open: true,
                menu: null
            }
        }
        case "GLOBAL CLICK": {
            return {
                open: false,
                menu: null
            }
        } 
        default:
            return state;
    }
}

export default sideBar;