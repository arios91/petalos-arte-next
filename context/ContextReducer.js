const contextReducer = (state, action) => {
    switch(action.type){
        case 'SET_AWAY_MESSAGE':
            return {
                ...state,
                awayMessage: action.payload
            }
        case 'SET_NOTICE_MESSAGE':
            return {
                ...state,
                noticeMessage: action.payload
            }
        case 'SET_AWAY':
            return{
                ...state,
                away: action.payload
            }
        case 'SET_NOTICE':
            return{
                ...state,
                notice: action.payload
            }
        case 'SET_CURRENT_PAGE':
            return{
                ...state,
                currentPage: action.payload
            }
        case 'SET_CURRENT_ADDONS':
            return{
                ...state,
                currentAddons: action.payload
            }
        case 'SET_CURRENT_ARRANGEMENT':
            return{
                ...state,
                currentArrangement: action.payload
            }
        case 'ADD_TO_CART':
            return{
                ...state,
                cartItems: [action.payload, ...state.cartItems]
            }
        case 'SET_CART':
            return{
                ...state,
                cartItems: action.payload
            }
        case 'SET_RECEIPT':
            return{
                ...state,
                receipt: action.payload
            }
        case 'SET_LOADING':
            return{
                ...state,
                isLoading: action.payload
            }
        default:
            return state

    }

}

export default contextReducer