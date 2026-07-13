import { getAllRepairs } from '@/db';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as z from "zod";

const RepairReduxSchema = z.object({
    id: z.number(),
    clientId: z.number(),
    clientName: z.string(),
    desc: z.string(),
    isPaid: z.number().optional(),
    paidAt: z.string().optional(),
    price: z.number(),
    createdAt: z.string(),
    isDelivered: z.number(),
    deliveredAt: z.string().optional(),
});

export type RepairRedux = z.infer<typeof RepairReduxSchema>;


const getRepairsInitialState = {
    success: false,
    load: false,
    repairs: [] as RepairRedux[],
    error: "",
}

export const getRepairsThunk = createAsyncThunk(
    "get/repairs",
    async () => {

        const response = await getAllRepairs();

        if (typeof response !== 'string') {

            return response.map((res) => {
                return {
                    ...res,
                    createdAt: new Date(res.createdAt).toISOString(),
                    paidAt: res.paidAt?.toISOString(),
                    deliveredAt: res.deliveredAt?.toISOString()
                }
            })
        }

        throw new Error(response);

    },
)

export const repairSlice = createSlice({
    name: 'repair',
    initialState: getRepairsInitialState,
    reducers: {
        reset: (state) => {
            state.success = false
            state.error = ''
            state.load = false
            state.repairs = [] as RepairRedux[]
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getRepairsThunk.pending, (state) => {
                state.load = true
                state.repairs = [] as RepairRedux[]
            })
            .addCase(getRepairsThunk.fulfilled, (state, action) => {
                state.error = ''
                state.load = false
                state.success = true
                state.repairs = action.payload
            })
            .addCase(getRepairsThunk.rejected, (state, action) => {
                state.error = action.error.message as string
                state.load = false
                state.success = false
            })
    }
})

export const { reset } = repairSlice.actions

export default repairSlice.reducer