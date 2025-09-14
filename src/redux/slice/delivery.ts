// redux/slice/delivery.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export interface Settings {
  takeDeliveryFee: boolean;
  checkThreshold: boolean;
  deliveryFee: number; 
  freeDeliveryThreshold: number;
  allowedZipCodes: string[];
}

interface DeliverySetting {
  status: "idle" | "loading" | "succeeded" | "failed";
  deliverySetting: Settings | null;
  error: string | null;
}

const initialState: DeliverySetting = {
  status: "idle",
  deliverySetting: null,
  error: null,
};

// Fetch delivery settings
export const fetchDeliverySetting = createAsyncThunk(
  "delivery/fetchDeliverySetting", 
  async () => {
    const response = await instance.get("/product/delivery");
    return response.data.setting;
  }
);

const deliverySlice = createSlice({
  name: "delivery", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDeliverySetting.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchDeliverySetting.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.deliverySetting = action.payload;
      state.error = null;
    });
    builder.addCase(fetchDeliverySetting.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default deliverySlice.reducer;