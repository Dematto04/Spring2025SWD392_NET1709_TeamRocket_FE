import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  additionalService: [],
  address: {},
  serviceBooking: {}
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    toggleAdditional: (state, action) => {
      const service = action.payload; 
      const index = state.additionalService.findIndex(item => item.id === service.id);

      if (index !== -1) {
        state.additionalService.splice(index, 1); 
      } else {
        state.additionalService.push(service); 
      }
    },
    addAddress: (state, action) => {
      state.address = action.payload;
    },
    serviceBooking: (state, action) => {
      state.serviceBooking = action.payload;
    },
  },
});

export const selectAdditional = (state) => state.booking.additionalService;
export const selectAddress = (state) => state.booking.address;
export const selectServiceBooking = (state) => state.booking.serviceBooking;

export const { toggleAdditional, addAddress, serviceBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
