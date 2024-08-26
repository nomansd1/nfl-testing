import { configureStore } from "@reduxjs/toolkit"
import sessionReducer from '@/store/session-reducer'
import cartReducer from "./cart-reducer"


export const store = configureStore({
    reducer: {
        auth: sessionReducer,
        cart: cartReducer
        // Other reducers
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch