import { GET_ALL_HOTELS, GET_ALL_BOOKINGS } from "../actions/hotelActions"

const initialState = {
    hotels: [],
    bookings: []
}

const hotelReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_HOTELS:
            return {
                ...state,
                hotels: action.payload
            }
        case GET_ALL_BOOKINGS:
            return {
                ...state,
                bookings: action.payload
            }
        default:
            return state
    }
}

export default hotelReducer
