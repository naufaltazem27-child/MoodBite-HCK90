import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { api } from "../helpers/http";
import Navbar from "../components/Navbar";
import { FaUserCircle, FaLock, FaSave, FaCheckCircle } from "react-icons/fa";

export default function ProfilePage() {
  const { username } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      Swal.fire("Error", "Password must be at least 5 characters", "warning");
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "warning");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      await api.patch(
        "/update-password",
        { newPassword: password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your password has been updated.",
        confirmButtonColor: "#ea580c",
      });

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-12 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your profile and security preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: Profile Summary Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/60 border border-white p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-4 shadow-inner">
                <FaUserCircle size={64} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {username}
              </h2>
              <p className="text-sm text-gray-500 mb-6">Food Enthusiast</p>

              <div className="w-full bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-3 text-left">
                <FaCheckCircle className="text-green-500 text-xl" />
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase">
                    Account Status
                  </p>
                  <p className="text-sm font-bold text-gray-800">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Update Password Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/60 border border-white p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                  <FaLock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-500">
                    Change your account password
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleUpdatePassword}
                className="space-y-6 max-w-lg"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 pl-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 5 characters"
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 pl-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Updating..."
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
