// UserVAErecords.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
};

export const UserVAErecords = createSlice({
  name: "vaeRecords",
  initialState,
  reducers: {
    setVAERecords: (state, action) => {
      state.records = action.payload; // Sets the entire records array
    },
    updateVAERecord: (state, action) => {
      const updatedRecord = action.payload;
      state.records = state.records.map((record) =>
        record.visit_id === updatedRecord.visit_id ? updatedRecord : record,
      ); // Updates a specific record
    },
    deleteVAERecord: (state, action) => {
      const visit_id = action.payload;
      state.records = state.records.filter(
        (record) => record.visit_id !== visit_id,
      ); // Removes a record by visit_id
    },
  },
});

export const { setVAERecords, updateVAERecord, deleteVAERecord } =
  UserVAErecords.actions;

export default UserVAErecords.reducer;
