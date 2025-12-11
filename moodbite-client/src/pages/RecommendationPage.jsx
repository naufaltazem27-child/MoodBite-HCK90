import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../helpers/http";
import {
  FaUtensils,
  FaHome,
  FaHeart,
  FaUserCog,
  FaSignOutAlt,
  FaClock,
  FaFire,
  FaLeaf,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.user);
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

      Toast.fire({
        icon: "success",
        title: "Recipe saved to Favorites",
      });
    } catch (error) {
      Swal.fire("Error", "Failed to save recipe", "error");
    }
  };

  const handleViewDetail = (recipe) => {
    // Menampilkan Detail via Modal (Tanpa Save dulu)
    Swal.fire({
      title: `<h2 class="text-2xl font-bold text-gray-800">${recipe.title}</h2>`,
      html: `
            <div class="text-left">
                <div class="mb-4">
                    <h3 class="font-bold text-orange-600 uppercase text-xs mb-2">Ingredients:</h3>
                    <ul class="text-sm list-disc pl-4 space-y-1 text-gray-600 max-h-32 overflow-y-auto">
                        ${recipe.ingredients
                          .map((ing) => `<li>${ing}</li>`)
                          .join("")}
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-orange-600 uppercase text-xs mb-2">Instructions:</h3>
                    <ol class="text-sm list-decimal pl-4 space-y-2 text-gray-600 max-h-40 overflow-y-auto">
                        ${recipe.instructions
                          .map((step) => `<li>${step}</li>`)
                          .join("")}
                    </ol>
                </div>
            </div>
        `,
      imageUrl: recipe.image,
      imageHeight: 200,
      imageAlt: recipe.title,
      showCancelButton: true,
      confirmButtonText: "Save to Favorites",
      confirmButtonColor: "#ea580c",
      cancelButtonText: "Close",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave(recipe);
      }
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      {/* === BACKGROUND === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      {/* === NAVBAR (Floating Pill) === */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-white/40 shadow-lg rounded-full px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-full text-orange-600">
              <FaUtensils size={16} />
            </div>
            <span className="font-bold text-lg hidden sm:block">MoodBite</span>
          </div>
          {/* ... Menu Links Sama Seperti Sebelumnya ... */}
          <div className="flex items-center gap-4 pl-2">
            <span className="text-xs font-bold text-gray-500 hidden md:block">
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* === MAIN CONTENT === */}
      {/* pt-28 agar tidak tertutup navbar */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-8 flex-grow flex flex-col">
        {/* Header Compact */}
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-2xl">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-orange-600 font-bold text-xs mb-1 flex items-center gap-1"
            >
              <FaArrowLeft /> Try Another Mood
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Chef's Pick for{" "}
              <span className="text-orange-500">"{currentMood}"</span>
            </h1>
            {/* HANDLING TEXT PANJANG: Line Clamp */}
            <p className="text-xs text-gray-500 mt-1 line-clamp-1 overflow-hidden text-ellipsis">
              Here are some comfort meals curated just for your current
              situation.
            </p>
          </div>
        </div>

        {/* Recipe Grid (Compact Mode) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {recommendations.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg border border-white/60 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
            >
              {/* Compact Image Height (h-48 -> h-40) agar muat di layar */}
              <div className="relative h-40 bg-gray-200 group overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                  <FaClock className="text-orange-500" />{" "}
                  {recipe.readyInMinutes}m
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-3 line-clamp-2 min-h-[3.5rem]">
                  {recipe.title}
                </h2>

                {/* Nutrition Compact Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-orange-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Kcal
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {recipe.calories?.replace(" kcal", "") || "-"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Prot
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {recipe.protein?.replace(" g", "") || "-"}
                    </p>
                  </div>
                  {/* FAT ditampilkan jika ada */}
                  <div className="bg-yellow-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Fat
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {recipe.fat?.replace(" g", "") || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex-grow"></div>

                {/* Action Buttons Row */}
                <div className="flex gap-2 mt-2">
                  {/* Primary: View Detail */}
                  <button
                    onClick={() => handleViewDetail(recipe)}
                    className="flex-grow bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaEye /> View Recipe
                  </button>

                  {/* Secondary: Save (Heart Icon) */}
                  <button
                    onClick={() => handleSave(recipe)}
                    className="w-12 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                    title="Save to Favorites"
                  >
                    <FaHeart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
