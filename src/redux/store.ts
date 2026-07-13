import { configureStore } from '@reduxjs/toolkit'
import ClientReducer from '@/redux/slices/ClientSlice'
import RepairReducer from '@/redux/slices/RepairSlice'

export const store = configureStore({
    reducer: {
        client: ClientReducer,
        repair: RepairReducer
    },
})


export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<AppStore["getState"]>