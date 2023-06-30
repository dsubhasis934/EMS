export const setLoggedInUser = (userData) => {
    return {
        type: 'SET_LOGGED_IN_USER',
        payload: userData
    };
};