import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";
import type { Category } from "../../types/products.types"; // Import the existing Category type

interface CategoriesItems {
  categories: Category[] | null; // Use the existing Category type
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesItems = {
  categories: null,
  status: "idle",
  error: null,
};

// Fetch categories details
export const fetchCategories = createAsyncThunk("categories/fetchCategory", async () => {
  const response = await instance.get("/product/categories");
  return response.data.categories;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categories = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default categoriesSlice.reducer;
