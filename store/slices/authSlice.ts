import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    _id: string;
    id: number,
    name: string;
    email: string;
    verified: boolean;
}

interface AuthState {
    user: UserState | null;
}

const initialState: AuthState = {
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<UserState>) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
