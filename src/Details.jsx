import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { addToFavorite, deleteFavorite } from "./slice/favoriteSlice";
import { booksAPI, favoritesAPI } from "./utils/api";

const Details = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorite);
  const { book } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getById(book);
        setBookDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
        // Fallback to external API if backend is not available
        try {
          const fallbackResponse = await fetch(`https://example-data.draftbit.com/books/${book}`);
          const fallbackData = await fallbackResponse.json();
          setBookDetails(fallbackData);
        } catch (fallbackErr) {
          console.error("Fallback API also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [book]);
  const favChecker = (id) => {
    const boolean = favorites.some((book) => book.id === id);
    return boolean;
  };
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-xl text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error && !bookDetails) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
        >
          ← Back to Books
        </button>
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
      >
        ← Back to Books
      </button>
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-semibold">Warning:</p>
          <p>{error}</p>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <img
              src={bookDetails?.image_url}
              alt={bookDetails?.title}
              className="w-full max-w-sm h-auto rounded-lg shadow-lg object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
              }}
            />
          </div>
          <div className="md:w-2/3 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {bookDetails?.title}
            </h1>
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold text-gray-800">Authors:</span>{" "}
                <span className="text-blue-600">{bookDetails?.authors || "Unknown"}</span>
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="ml-1 text-gray-700 font-semibold">
                    {bookDetails?.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ${((bookDetails?.rating || 0) * 5).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {bookDetails?.description || "No description available for this book."}
              </p>
            </div>
            <div className="flex gap-4">
              {favChecker(bookDetails?.id) ? (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  onClick={async () => {
                    dispatch(deleteFavorite(bookDetails));
                    try {
                      await favoritesAPI.remove(bookDetails.id);
                    } catch (err) {
                      console.error("Error removing favorite:", err);
                    }
                  }}
                >
                  <span>❌</span>
                  Remove from Favorites
                </button>
              ) : (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  onClick={async () => {
                    dispatch(addToFavorite(bookDetails));
                    try {
                      await favoritesAPI.add(bookDetails);
                    } catch (err) {
                      console.error("Error adding favorite:", err);
                    }
                  }}
                >
                  <span>❤️</span>
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
