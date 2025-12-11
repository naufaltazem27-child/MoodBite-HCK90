import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../helpers/http";

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (googleToken, { rejectWithValue }) => {
    try {
      // Kirim token Google ke Backend kita
      const { data } = await api.post("/google-login", { googleToken });

      // Simpan token dari backend ke LocalStorage (biar pas refresh gak log out)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);

      return data; // Masuk ke action.payload
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Kirim data ke endpoint login biasa
      const { data } = await api.post("/login", { email, password });

      // Simpan token & username
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/register", formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await api.put("/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update nama di localStorage agar saat refresh nama baru tetap muncul
      localStorage.setItem("username", data.user.username);

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Fetch failed" }
      );
    }
  }
);

// --- SLICE (State Management) ---
const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: !!localStorage.getItem("access_token"),
    username: localStorage.getItem("username") || "",
    email: "",
    phoneNumber: "",
    address: "",
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.isLoggedIn = false;
      state.username = "";
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Saat Login Loading
      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
      })
      // Saat Login Sukses
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.username = action.payload.username;
      })
      // Saat Login Gagal
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login Failed";
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.username = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload.username;
        state.phoneNumber = action.payload.phoneNumber;
        state.address = action.payload.address;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.address = action.payload.address;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
