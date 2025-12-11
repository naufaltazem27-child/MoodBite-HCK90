import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../helpers/http";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { FaTrash, FaEye, FaArrowRight, FaBookOpen } from "react-icons/fa";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const { data } = await api.get("/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove Recipe?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await api.delete(`/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((recipe) => recipe.id !== id));
        Swal.fire("Deleted!", "Recipe removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete", "error");
      }
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-12 flex-grow flex flex-col">
        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              My Cookbook
            </h1>
            <p className="text-gray-500 mt-2">
              Your personal collection of comfort foods.
            </p>
          </div>
          {!loading && favorites.length > 0 && (
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-bold text-orange-600 border border-orange-100">
              {favorites.length} Saved Recipes
            </span>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-white/50 rounded-[2rem] animate-pulse"
              ></div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white p-6 rounded-full shadow-xl shadow-orange-100 mb-6">
              <FaBookOpen size={48} className="text-orange-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No recipes yet?
            </h2>
            <p className="text-gray-500 max-w-md mb-8">
              Go back to home and ask Chef AI for recommendation!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2"
            >
              Find Food Now <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                moodLabel={recipe.mood}
              >
                {/* BUTTONS SPECIFIC FOR FAVORITES PAGE */}
                <button
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="flex-grow bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-200 text-sm font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaEye /> Cook Now
                </button>

                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="w-14 bg-white border-2 border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
                  title="Remove from Favorites"
                >
                  <FaTrash size={16} />
                </button>
              </RecipeCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
