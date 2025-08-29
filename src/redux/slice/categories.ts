import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

interface CategoriesItems {
  categories: Categories[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Categories {
  id: string;
  name: string;
  parentId: null;
  imageUrl: null;
  altText: null;
  children: Children[] | null;
}
export interface Children {
  id: string;
  name: string;
  parentId: string;
  imageUrl: string;
  altText: string;
  children: [];
}
const initialState: CategoriesItems = {
  categories: null,
  status: "idle",
  error: null,
};

// Fetch categories details
export const fetchCategories = createAsyncThunk("categories/fetchCategory", async () => {
  const response = await instance.get("/api/product/categories");
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
