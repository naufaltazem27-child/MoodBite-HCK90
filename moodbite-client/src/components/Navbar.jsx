import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import Swal from "sweetalert2";
import {
  FaUtensils,
  FaHome,
  FaHeart,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.user);

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
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 animate-fade-in-down">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-white/40 shadow-xl shadow-gray-200/50 rounded-full px-6 py-3 flex justify-between items-center transition-all">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <FaUtensils size={16} />
          </div>
          <Link
            to={"/"}
            className="font-bold text-lg tracking-tight text-gray-900 hidden sm:block"
          >
            MoodBite
          </Link>
        </div>

        {/* Menu Links */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-orange-100 text-orange-600 border-1 border-orange-300 scale-105"
                  : "text-gray-400 hover:text-orange-400"
              }`
            }
          >
            <FaHome /> <span className="hidden sm:inline">Home</span>
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-orange-100 text-orange-600 border-1 border-orange-300 scale-105"
                  : "text-gray-400 hover:text-orange-400"
              }`
            }
          >
            <FaHeart /> <span className="hidden sm:inline">Favorites</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-orange-100 text-orange-600 border-1 border-orange-300 scale-105"
                  : "text-gray-400 hover:text-orange-400"
              }`
            }
          >
            <FaUserCog /> <span className="hidden sm:inline">Profile</span>
          </NavLink>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 pl-2">
          <span className="text-xs font-bold text-gray-500 hidden md:block uppercase tracking-wider">
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
  );
}
