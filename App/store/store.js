import { configureStore } from "@reduxjs/toolkit"
import historySlice from "./historySlice"
import savedSlice from "./savedSlice"

export default configureStore({
    reducer: {
        history: historySlice,
        saved: savedSlice
    },
})