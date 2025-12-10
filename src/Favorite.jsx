import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteFavorite, setFavorites } from "./slice/favoriteSlice";
import { favoritesAPI } from "./utils/api";

const Favorite = () => {
  const navigate = useNavigate();

  const favorites = useSelector((state) => state.favorite);
  const dispatch = useDispatch();

  // Load favorites from backend on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await favoritesAPI.getAll();
        if (response.data.data && response.data.data.length > 0) {
          dispatch(setFavorites(response.data.data));
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };
    loadFavorites();
  }, [dispatch]);

  const handleDelete = async (book) => {
    dispatch(deleteFavorite(book));
    try {
      await favoritesAPI.remove(book.id);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        My Favorite Books
      </h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites?.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ring-2 ring-blue-500"
            >
              <div className="relative">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => navigate(`/details/${book.id}`)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ❤️ Favorited
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                  onClick={() => navigate(`/details/${book.id}`)}
                  title={book.title}
                >
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Authors:</span> {book.authors || "Unknown"}
                </p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => navigate(`/details/${book.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => handleDelete(book)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            No Favorite Books Yet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Start adding books to your favorites to see them here!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Browse Books
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorite;
