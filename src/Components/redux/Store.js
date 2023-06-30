// import { createStore, combineReducers } from 'redux';
// import userReducer from './UserReducer';

// const rootReducer = combineReducers({
//     user: userReducer
// });

// const store = createStore(rootReducer);

// export default store;
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './UserReducer'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
const config = {
    key: 'root',
    version: 1, storage
}
const reducer = combineReducers({ counter: counterReducer })
const persistedReducer = persistReducer(config, reducer)
export const store = configureStore({
    reducer: persistedReducer
})