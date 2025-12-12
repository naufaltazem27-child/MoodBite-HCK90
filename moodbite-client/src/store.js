import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import recipeReducer from "./features/recipeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: recipeReducer,
  },
});
