// import { setLoggedInUser } from './UserAction'
// const initialState = {
//     loggedInUser: null
// };

// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'SET_LOGGED_IN_USER':
//             return {
//                 ...state,
//                 loggedInUser: action.payload
//             };
//         default:
//             return state;
//     }
// };

// export default userReducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedInuser: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SET_LOGGED_IN_USER: (state, action) => {
            state.loggedInuser = action.payload;
        },
        // Other reducer cases...
    }
});

export const { SET_LOGGED_IN_USER } = userSlice.actions;

export default userSlice.reducer;
