import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recommended: null,
  newRelease: null,
  original: null,
  trending: null,

  // Search State Persistence
  searchQuery: '',
  searchResults: [],
  sortBy: 'year',
  isAscending: false,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.recommended = action.payload.recommended;
      state.newRelease = action.payload.newRelease;
      state.original = action.payload.original;
      state.trending = action.payload.trending;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.results;
      state.searchQuery = action.payload.query;
    },
    setSortConfig: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.isAscending = action.payload.isAscending;
    },
  },
});

// Actions
export const { setMovies, setSearchResults, setSortConfig } =
  movieSlice.actions;

// Category Selectors
export const selectRecommended = (state) => state.movie.recommended;
export const selectNewRelease = (state) => state.movie.newRelease;
export const selectOriginal = (state) => state.movie.original;
export const selectTrending = (state) => state.movie.trending;

// Search Selectors
export const selectSearchResults = (state) => state.movie.searchResults;
export const selectSearchQuery = (state) => state.movie.searchQuery;
export const selectSortBy = (state) => state.movie.sortBy;
export const selectIsAscending = (state) => state.movie.isAscending;

// Default Export
export default movieSlice.reducer;
