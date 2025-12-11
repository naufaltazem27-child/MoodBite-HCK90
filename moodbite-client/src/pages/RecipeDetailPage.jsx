import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../helpers/http";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaClock,
  FaFire,
  FaLeaf,
  FaUtensils,
} from "react-icons/fa";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const { data } = await api.get(`/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(data);
      } catch (error) {
        Swal.fire("Error", "Recipe not found", "error");
        navigate("/favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-orange-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white mb-4 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full backdrop-blur-md w-fit transition-all hover:bg-black/40"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight shadow-black drop-shadow-lg">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-white/90 font-bold text-sm">
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
              <FaClock className="text-orange-400" /> {recipe.readyInMinutes}{" "}
              Mins
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
              <FaFire className="text-orange-400" /> {recipe.calories}
            </span>
            <span className="flex items-center bg-orange-600/60 px-3 py-1.5 rounded-lg uppercase text-[10px] tracking-widest">
              Mood: {recipe.mood}
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <FaUtensils size={14} />
                </span>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-600 text-sm pb-3 border-b border-dashed border-gray-100 last:border-0"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition Card */}
            <div className="mt-6 bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
              <h3 className="text-lg font-bold text-orange-800 mb-4">
                Nutritional Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Protein</span>{" "}
                  <span className="font-bold">{recipe.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat</span>{" "}
                  <span className="font-bold">{recipe.fat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calories</span>{" "}
                  <span className="font-bold">{recipe.calories}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Cooking Instructions
              </h3>
              <div className="space-y-8">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-gray-500/30">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
