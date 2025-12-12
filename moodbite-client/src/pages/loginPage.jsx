import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { googleLogin, loginUser } from "../features/userSlice";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaUtensils } from "react-icons/fa";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, status } = useSelector((state) => state.user);
  const isLoading = status === "loading";

  const [formData, setFormData] = useState({ email: "", password: "" });

  // --- CAROUSEL LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", // Dark Food Table
      text: "Comfort Food for Rainy Days",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop", // Healthy Salad
      text: "Fresh Greens for a Healthy Mood",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop", // Pizza
      text: "Cheesy Slices for Happy Times",
    },
  ];

  // Auto-play Carousel (Ganti setiap 5 detik)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // --- AUTH LOGIC ---
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }
    try {
      await dispatch(loginUser(formData)).unwrap();
      showSuccessAlert();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials",
        confirmButtonColor: "#ea580c",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      showSuccessAlert();
    } catch (error) {
      Swal.fire("Error", "Google Login Failed", "error");
    }
  };

  const showSuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: `Welcome back!`,
      text: "Ready to find your mood food?",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900">
      {/* === BACKGROUND CAROUSEL LAYER === */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay Gelap agar form terbaca */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 backdrop-blur-[2px]"></div>
        </div>
      ))}

      {/* === CONTENT GRID LAYER (Split 2 Columns) === */}
      <div className="relative z-10 w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 h-full min-h-screen">
        {/* --- LEFT COLUMN: BRANDING & TEXT --- */}
        <div className="hidden lg:flex flex-col justify-center px-12 text-white space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl w-fit border border-white/20">
            <FaUtensils size={32} className="text-orange-400" />
          </div>

          <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">
            Feed your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Feelings.
            </span>
          </h1>

          {/* Text carousel yang berubah sesuai slide */}
          <p className="text-xl text-gray-200 max-w-lg transition-all duration-500 font-light">
            {slides[currentSlide].text}
          </p>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-8 bg-orange-500" : "w-2 bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: OVERLAY FORM CARD --- */}
        <div className="flex items-center justify-center lg:justify-end py-12">
          {/* CARD LOGIN (Overlay Model) */}
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-[420px] lg:mr-12 border border-white/50 backdrop-blur-sm animate-fade-in-up">
            {/* Header di dalam Card */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <FaUtensils size={18} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">MoodBite</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Welcome back! Please login.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 mt-4 cursor-pointer"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Button */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  Swal.fire("Error", "Google Auth Failed", "error")
                }
                theme="outline"
                shape="pill"
                size="large"
                text="signin_with"
                width="350"
              />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              New here?{" "}
              <Link
                to="/register"
                className="font-bold text-orange-600 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
