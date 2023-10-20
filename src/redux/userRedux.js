import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        users: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        // USERS
        getUsersStart: (state) => {
            state.isFetching = true;
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.users = action.payload;
        },
        getUsersFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        // USER
        //DELETE
        deleteUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteUserSuccess: (state, action) => {
            state.isFetching = false;
            state.error = false;
            state.users.splice(
                state.users.findIndex(item => item._id === action.payload),
                1
            );
        },
        deleteUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        //UPDATE
        updateUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUserSuccess: (state, action) => {
            state.isFetching = false;
            state.error = false;
            state.users[state.users.findIndex(item => item._id === action.payload.id)] = action.payload.user;
        },
        updateUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },


        
    },

});

export const {
    loginStart, loginSuccess, loginFailure,
    getUsersStart, getUsersSuccess, getUsersFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    updateUserStart, updateUserSuccess, updateUserFailure
} = userSlice.actions;
export default userSlice.reducer;