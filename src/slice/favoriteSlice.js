import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  initialState: [],
  name: "favoriteSlice",
  reducers: {
    addToFavorite: (state, action) => {
      const findBook = state.find((book) => book.id === action.payload.id);
      if (findBook) {
        findBook.quantity += 1;
      } else {
        const cloneState = { ...action.payload, quantity: 1 };

        state.push(cloneState);
      }
    },
    deleteFavorite: (state, action) => {
      return state.filter((book) => book.id !== action.payload.id);
    },
    setFavorites: (state, action) => {
      return action.payload;
    },
  },
 
});
export const { addToFavorite, deleteFavorite, setFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
