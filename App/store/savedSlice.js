import { createSlice } from "@reduxjs/toolkit";

const savedSlice = createSlice({
    name: 'saved',
    initialState: {
        items: []
    },
    reducers: {
        setSaved: (state, action) => {
            state.items = action.payload.items;
        }
    }
});

export const { setSaved } = savedSlice.actions;
export default savedSlice.reducer;