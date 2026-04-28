import { createStore, applyMiddleware, combineReducers } from "redux"
import { thunk } from "redux-thunk"

import hotelReducer from "./redux/reducers/hotelReducer"

const reducers = combineReducers({
    hotelReducer: hotelReducer
})

export const store = createStore(reducers, applyMiddleware(thunk))
