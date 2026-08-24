import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice.jsx";
import movieReducer from "../features/movie/MovieSlice.jsx";

export default configureStore({
  reducer: {
    user: userReducer,
    movie: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
