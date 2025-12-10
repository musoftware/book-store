import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToFavorite, deleteFavorite } from "./slice/favoriteSlice";
import { booksAPI, favoritesAPI } from "./utils/api";

function Home() {
  const favorites = useSelector((state) => state.favorite);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favChecker = (id) => {
    const boolean = favorites.some((book) => book.id === id);
    return boolean;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getAll();
        setBooks(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
        // Fallback to external API if backend is not available
        try {
          const fallbackResponse = await fetch("https://example-data.draftbit.com/books?_limit=100");
          const fallbackData = await fallbackResponse.json();
          setBooks(fallbackData);
        } catch (fallbackErr) {
          console.error("Fallback API also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="Home">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-xl text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="Home">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Home">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Discover Your Next Favorite Book
      </h1>
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-semibold">Warning:</p>
          <p>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books?.map((book) => (
          <div
            key={book.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              favChecker(book.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
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
              {favChecker(book.id) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ❤️ Favorited
                </div>
              )}
            </div>
            <div className="p-4">
              <h3
                className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                onClick={() => navigate(`/details/${book.id}`)}
                title={book.title}
              >
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Authors:</span> {book.authors || "Unknown"}
              </p>
              <p className="text-lg font-bold text-blue-600 mb-4">
                ${(book.rating * 7).toFixed(2)}
              </p>
              {favChecker(book.id) ? (
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  onClick={async () => {
                    dispatch(deleteFavorite(book));
                    try {
                      await favoritesAPI.remove(book.id);
                    } catch (err) {
                      console.error("Error removing favorite:", err);
                    }
                  }}
                >
                  Remove from Favorites
                </button>
              ) : (
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  onClick={async () => {
                    dispatch(addToFavorite(book));
                    try {
                      await favoritesAPI.add(book);
                    } catch (err) {
                      console.error("Error adding favorite:", err);
                    }
                  }}
                >
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
