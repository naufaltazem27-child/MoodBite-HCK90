import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { fetchAiRecommendation } from "../features/recipeSlice";
import { logout } from "../features/userSlice";
import Swal from "sweetalert2";
import {
  FaUtensils,
  FaSignOutAlt,
  FaMagic,
  FaSearch,
  FaHome,
  FaHeart,
  FaUserCog,
} from "react-icons/fa";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.recipes);
  const isLoading = status === "loading";

  const [activeMood, setActiveMood] = useState("");
  const [userNote, setUserNote] = useState("");

  const moodOptions = [
    { label: "Happy", emoji: "😊" },
    { label: "Sad", emoji: "😢" },
    { label: "Tired", emoji: "😴" },
    { label: "Angry", emoji: "😤" },
    { label: "Romantic", emoji: "🥰" },
    { label: "Healthy", emoji: "🥗" },
    { label: "Excited", emoji: "🤩" },
    { label: "Lazy", emoji: "🦥" },
  ];

  const handleGenerate = async () => {
    if (!activeMood && !userNote) {
      Swal.fire(
        "Info",
        "Please select a mood or describe how you feel.",
        "info"
      );
      return;
    }
    const finalPrompt = `${activeMood ? activeMood : ""}. ${
      userNote ? `Context: ${userNote}` : ""
    }`;

    try {
      await dispatch(fetchAiRecommendation(finalPrompt)).unwrap();
      navigate("/recommendation");
    } catch (error) {
      Swal.fire("Oops", "Failed to generate recipes. Try again.", "error");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to leave?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        {/* Blob Kuning */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        {/* Blob Orange */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
        {/* Blob Pink/Red di bawah */}
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* === NAVBAR (Floating Pill Style) === */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-white/40 shadow-xl shadow-gray-200/50 rounded-full px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-full text-orange-600">
              <FaUtensils size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 hidden sm:block">
              MoodBite
            </span>
          </div>

          {/* Menu Links (Center) */}
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              <FaHome /> <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              <FaHeart /> <span className="hidden sm:inline">Favorites</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              <FaUserCog /> <span className="hidden sm:inline">Profile</span>
            </NavLink>
          </div>

          {/* User & Logout (Right) */}
          <div className="flex items-center gap-4 pl-2">
            <span className="text-xs font-bold text-gray-500 hidden md:block">
              {username}
            </span>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* === MAIN CONTENT (Mood Selector) === */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pt-32 pb-12 flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wide uppercase border border-orange-100">
            AI Powered Chef
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            What are you <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              craving today?
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            Describe your mood or situation, and let our AI curate the perfect
            comfort food for you.
          </p>
        </div>

        {/* === CARD INTERACTION === */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-orange-500/10 p-8 md:p-10 border border-white/60">
          {/* 1. MOOD SELECTOR */}
          <div className="mb-8">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 block">
              Pick a base mood
            </label>
            <div className="flex flex-wrap justify-center gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() =>
                    setActiveMood(mood.label === activeMood ? "" : mood.label)
                  }
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    activeMood === mood.label
                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105"
                      : "bg-white border-gray-100 text-gray-600 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. TEXT INPUT */}
          <div className="mb-8">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 block">
              Add specific details (Optional)
            </label>
            <div className="relative group">
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="E.g., It's raining outside and I want something warm and spicy..."
                rows="3"
                className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 resize-none transition-all duration-300 group-hover:bg-white"
              ></textarea>
              <div className="absolute bottom-4 right-4 text-orange-300 pointer-events-none">
                <FaMagic />
              </div>
            </div>
          </div>

          {/* 3. GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-lg font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cooking up ideas...
              </>
            ) : (
              <>
                <FaSearch className="group-hover:scale-110 transition-transform" />
                Find My Food
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
