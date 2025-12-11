import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../helpers/http";

// --- THUNK: Minta Rekomendasi ke AI ---
export const fetchAiRecommendation = createAsyncThunk(
  "recipes/fetchAi",
  async (moodInput, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/gemini-recommend",
        { mood: moodInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return data; // Isinya: { mood: "Sad", recipes: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// --- SLICE ---
const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    recommendations: [], // Hasil dari AI disimpan di sini
    currentMood: "",
    status: "idle",
    error: null,
  },
  reducers: {
    clearRecommendation: (state) => {
      state.recommendations = [];
      state.currentMood = "";
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiRecommendation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAiRecommendation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMood = action.payload.mood;
        state.recommendations = action.payload.recipes;
      })
      .addCase(fetchAiRecommendation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearRecommendation } = recipeSlice.actions;
export default recipeSlice.reducer;
