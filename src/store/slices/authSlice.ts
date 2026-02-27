import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    accessToken: string | null,
    user: {
        _id: string,
        fullName: string,
        email: string,
        profileImage: string | null,
    } | null,
    isAuthenticated: boolean,
};

const initialState: AuthState = {
    accessToken: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ _id: string, fullName: string, email: string, profileImage?: string | null }>) => {
            state.user = {
                _id: action.payload._id,
                fullName: action.payload.fullName,
                email: action.payload.email,
                profileImage: action.payload.profileImage ?? null,
            };
            state.isAuthenticated = true;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        clearUser: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export default authSlice.reducer;
export const { clearUser, setUser, setAccessToken } = authSlice.actions;