import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../helpers/http";
import Navbar from "../components/Navbar";
import { FaArrowLeft, FaEye, FaHeart } from "react-icons/fa";
import RecipeCard from "../components/RecipeCard";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const { recommendations, currentMood } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    if (recommendations.length === 0) navigate("/");
  }, [recommendations, navigate]);

  const handleSave = async (recipe) => {
    try {
      const payload = {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        imageUrl: recipe.image,
        mood: currentMood,
        calories: recipe.calories,
        protein: recipe.protein,
        fat: recipe.fat,
        readyInMinutes: recipe.readyInMinutes,
      };
      const token = localStorage.getItem("access_token");
      await api.post("/recipes", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({ icon: "success", title: "Recipe saved to Favorites" });
    } catch (error) {
      Swal.fire("Error", "Failed to save recipe", "error");
    }
  };

  const handleViewDetail = (recipe) => {
    Swal.fire({
      title: `<h2 class="text-2xl font-bold text-gray-800">${recipe.title}</h2>`,
      html: `
            <div class="text-left">
                <div class="mb-4 bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <h3 class="font-bold text-orange-700 uppercase text-xs mb-2 flex items-center gap-2">🥘 Ingredients</h3>
                    <ul class="text-sm list-disc pl-4 space-y-1 text-gray-700 max-h-32 overflow-y-auto custom-scrollbar">
                        ${recipe.ingredients
                          .map((ing) => `<li>${ing}</li>`)
                          .join("")}
                    </ul>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-700 uppercase text-xs mb-2 flex items-center gap-2">👨‍🍳 Instructions</h3>
                    <ol class="text-sm list-decimal pl-4 space-y-2 text-gray-600 max-h-40 overflow-y-auto custom-scrollbar">
                        ${recipe.instructions
                          .map((step) => `<li>${step}</li>`)
                          .join("")}
                    </ol>
                </div>
            </div>
        `,
      imageUrl: recipe.image,
      imageHeight: 250,
      imageAlt: recipe.title,
      showCancelButton: true,
      confirmButtonText: "Save to Favorites",
      confirmButtonColor: "#ea580c",
      cancelButtonText: "Close",
      showCloseButton: true,
      customClass: {
        popup: "rounded-[2rem]",
        image: "rounded-[1.5rem] mt-4",
      },
    }).then((result) => {
      if (result.isConfirmed) handleSave(recipe);
    });
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-12 flex-grow flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-orange-600 font-semibold text-s mb-2 flex items-center gap-1 transition-all hover:-translate-x-1"
          >
            <FaArrowLeft /> Try Another Mood
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-1xl md:text-2xl font-extrabold text-gray-900 leading-tight">
              Chef's Pick for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                "{currentMood}"
              </span>
            </h1>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-100">
              Found {recommendations.length} recipes
            </span>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe}>
              {/* BUTTON 1: View Recipe (Soft Orange) */}
              <button
                onClick={() => handleViewDetail(recipe)}
                className="flex-grow bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-sm font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaEye /> View Recipe
              </button>

              {/* BUTTON 2: Save Recipe (Solid Orange Icon) */}
              <button
                onClick={() => handleSave(recipe)}
                className="w-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Save to Favorites"
              >
                <FaHeart size={18} />
              </button>
            </RecipeCard>
          ))}
        </div>
      </main>
    </div>
  );
}
