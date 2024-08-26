import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalItems: 0,
    totalCartons: 0,
    totalValue: 0,
    filledWeigth: 0,
    filledVolume: 0,
    dispatchDate: "",

    noOfPallet: 0,
    allowedPalletsInContainer: 0,
    isPalletizedContainer: false
}

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        updateCartState: (state, data) => {
            state.totalItems = data.payload.totalItems;
            state.totalCartons = data.payload.totalCartons;
            state.totalValue = data.payload.totalValue;
            state.filledWeigth = data.payload.filledWeigth;
            state.filledVolume = data.payload.filledVolume;
            state.dispatchDate = data.payload.dispatchDate;
            state.noOfPallet = data.payload.noOfPallet;
            state.allowedPalletsInContainer = data.payload.allowedPalletsInContainer;
            state.isPalletizedContainer = data.payload.isPalletizedContainer;
        }
    }
});

export const { updateCartState } = cartSlice.actions;
export const totalItems = (state: any) => state.cart;
export default cartSlice.reducer;