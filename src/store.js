import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './events-slice';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
