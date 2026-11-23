import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://fakestoreapi.com/products";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(API_URL),
        fetch(`${API_URL}/categories`),
      ]);
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const items = await productsRes.json();
      const categories = await categoriesRes.json();
      return { items, categories };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong.");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.categories = action.payload.categories;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load products.";
      });
  },
});

export default productsSlice.reducer;
