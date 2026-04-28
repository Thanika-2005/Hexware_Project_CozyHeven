import axios from "axios"

export const GET_ALL_HOTELS = "GET_ALL_HOTELS"
export const GET_ALL_BOOKINGS = "GET_ALL_BOOKINGS"

export const getAllHotels = () => {
    return async (dispatch) => {
        const response = await axios.get("http://localhost:8080/api/hotel/get-allhotel?page=0&size=100", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        dispatch({
            type: GET_ALL_HOTELS,
            payload: (response.data.data) ? response.data.data : []
        })
    }
}

export const getAllBookings = () => {
    return async (dispatch) => {
        const response = await axios.get("http://localhost:8080/api/booking/get-allBooking?page=0&size=100", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        dispatch({
            type: GET_ALL_BOOKINGS,
            payload: (response.data.data) ? response.data.data : []
        })
    }
}
