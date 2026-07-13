import { getAllData, Stores, type Client } from '@/db'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const getClientsInitialState = {
    success: false,
    load: false,
    clients: [] as Client[],
    error: "",
}

export const getClientsThunk = createAsyncThunk(
    "get/clients",
    async () => {

        const response = await getAllData<Client>(Stores.Clients);

        if (typeof response !== 'string') {
            return response
        }

        throw new Error(response);

    },
)

export const clientSlice = createSlice({
    name: 'client',
    initialState: getClientsInitialState,
    reducers: {
        reset: (state) => {
            state.success = false
            state.error = ''
            state.load = false
            state.clients = [] as Client[]
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientsThunk.pending, (state) => { state.load = true })
            .addCase(getClientsThunk.fulfilled, (state, action) => {
                state.error = ''
                state.load = false
                state.success = true
                state.clients = action.payload
            })
            .addCase(getClientsThunk.rejected, (state, action) => {
                state.error = action.error.message as string
                state.load = false
                state.success = false
            })
    }
})

export const { reset } = clientSlice.actions

export default clientSlice.reducer