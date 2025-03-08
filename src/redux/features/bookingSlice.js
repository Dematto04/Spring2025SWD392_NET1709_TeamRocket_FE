import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  additionalService: [],
  address: {},
  serviceBooking: {},
  timeSlot: {},
  phoneNumber: "",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    toggleAdditional: (state, action) => {
      const service = action.payload;
      const index = state.additionalService.findIndex(
        (item) => item.id === service.id
      );

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
    timeSlot: (state, action) => {
      state.timeSlot = action.payload;
    },
    addPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
  },
});

export const selectAdditional = (state) => state.booking.additionalService;
export const selectAddress = (state) => state.booking.address;
export const selectServiceBooking = (state) => state.booking.serviceBooking;
export const selectServiceBookingTimeSlot = (state) => state.booking.timeSlot;
export const selectServiceBookingPhoneNumber = (state) =>
  state.booking.phoneNumber;

export const {
  toggleAdditional,
  addAddress,
  serviceBooking,
  timeSlot,
  addPhoneNumber,
} = bookingSlice.actions;
export default bookingSlice.reducer;
