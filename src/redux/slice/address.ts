// redux/slice/address.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService, {
  type CreateAddressPayload,
} from "../../services/address.services";
import type { Address } from "../../types/user.types";

interface AddressState {
  addresses: Address[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  status: "idle",
  error: null,
};

//  Fetch all user addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async () => {
    return await addressService.getAddresses();
  }
);

//  Create new address + refetch
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (payload: CreateAddressPayload, { dispatch }) => {
    await addressService.createAddress(payload);
    dispatch(fetchAddresses());
  }
);

//  Update address + refetch
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (
    {
      addressId,
      data,
    }: { addressId: string; data: Partial<CreateAddressPayload> },
    { dispatch }
  ) => {
    await addressService.updateAddress(addressId, data);
    dispatch(fetchAddresses());
  }
);

//  Delete address + refetch
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: string, { dispatch }) => {
    await addressService.deleteAddress(addressId);
    dispatch(fetchAddresses());
  }
);

//  Set default address + refetch
export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (addressId: string, { dispatch }) => {
    await addressService.setDefaultAddress(addressId);
    dispatch(fetchAddresses());
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch addresses";
        state.addresses = [];
      });
  },
});

export const { clearAddresses } = addressSlice.actions;

export default addressSlice.reducer;
