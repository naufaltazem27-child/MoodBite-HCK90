import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLogin } from "../features/userSlice"; // Import googleLogin
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaUtensils } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google"; // Import Google Component

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isLoggedIn } = useSelector((state) => state.user);
  const isLoading = status === "loading";

  // 1. REVISI FORM: Hanya 3 field utama
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // --- CAROUSEL BACKGROUND ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- REGISTER MANUAL ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      Swal.fire("Error", "Please fill in all fields", "warning");
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Please login with your new account.",
        confirmButtonColor: "#ea580c",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong",
        confirmButtonColor: "#ea580c",
      });
    }
  };

  // --- GOOGLE REGISTER/LOGIN ---
  // Logikanya sama: Google otomatis bikin user kalau belum ada (di backend)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      Swal.fire({
        icon: "success",
        title: `Welcome!`,
        text: "Account created successfully via Google.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/"); // Langsung masuk Home
    } catch (error) {
      Swal.fire("Error", "Google Auth Failed", "error");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900">
      {/* === BACKGROUND CAROUSEL === */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 backdrop-blur-[2px]"></div>
        </div>
      ))}

      {/* === CONTENT GRID === */}
      <div className="relative z-10 w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 h-full min-h-screen">
        {/* --- LEFT COLUMN: BRANDING --- */}
        <div className="hidden lg:flex flex-col justify-center px-12 text-white space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl w-fit border border-white/20">
            <FaUtensils size={32} className="text-orange-400" />
          </div>

          <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Food Revolution.
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-lg font-light">
            Create an account to start discovering meals that match your mood
            perfectly.
          </p>
        </div>

        {/* --- RIGHT COLUMN: REGISTER CARD (OVERLAY) --- */}
        <div className="flex items-center justify-center lg:justify-end py-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-[450px] lg:mr-12 border border-white/50 backdrop-blur-sm animate-fade-in-up overflow-y-auto custom-scrollbar">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm">
                Join MoodBite today for free.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Create a username"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 mt-6 cursor-pointer"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* --- 2. REVISI: DIVIDER & GOOGLE --- */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">
                OR REGISTER WITH
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  Swal.fire("Error", "Google Auth Failed", "error")
                }
                theme="outline"
                shape="pill"
                size="large"
                text="continue_with"
                width="350"
              />
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:underline"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
