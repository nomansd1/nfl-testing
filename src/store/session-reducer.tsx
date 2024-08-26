import { createSlice } from "@reduxjs/toolkit";

type SessionState = {
    isLoggedIn: Boolean,
    info?: UserInfo,
    settings?: any
}
const initialState: SessionState = {
    isLoggedIn: false
}

export const sessionSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login: (state, data) => {
            state.isLoggedIn = true;
            state.info = data.payload;
        },
        logout: (state, data) => {
            state.isLoggedIn = false;
            state.info = data.payload;
        },
        updateSettings: (state, data) => {
            state.settings = data.payload;
        }
    }
})

export const { login, logout, updateSettings } = sessionSlice.actions;
export const loggedInUser = (state: any) => state.auth;
export default sessionSlice.reducer;
