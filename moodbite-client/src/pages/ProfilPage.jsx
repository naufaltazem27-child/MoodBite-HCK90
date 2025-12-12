import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { api } from "../helpers/http";
import { fetchUserProfile, updateUserProfile } from "../features/userSlice";
import Navbar from "../components/Navbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaSave,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { username, email, phoneNumber, address } = useSelector(
    (state) => state.user
  );

  // State Tab: 'info' atau 'security'
  const [activeTab, setActiveTab] = useState("info");

  // --- STATE PERSONAL INFO ---
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // --- STATE OTP & PASSWORD ---
  const [otpStep, setOtpStep] = useState(1); // 1: Minta OTP, 2: Input OTP & Password Baru
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil Data User Saat Load
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setProfileForm({
      username: username || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      address: address || "",
    });
  }, [username, email, phoneNumber, address]);

  const handleInfoChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  // --- ACTION 1: UPDATE PROFILE (Nama, HP, Alamat) ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(updateUserProfile(profileForm)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your information has been saved.",
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#ea580c",
      });
    } catch (error) {
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION 2: KIRIM OTP ---
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await api.post(
        "/request-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "Check your email inbox for the code.",
        confirmButtonColor: "#ea580c",
      });
      setOtpStep(2); // Pindah ke layar input
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION 3: VERIFIKASI & GANTI PASSWORD ---
  const handleSubmitPass = async (e) => {
    e.preventDefault();
    if (newPassword.length < 5)
      return Swal.fire("Warning", "Password too short", "warning");

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await api.patch(
        "/reset-password-otp",
        { otp: otpCode, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Password changed successfully!", "success");
      // Reset Form
      setOtpStep(1);
      setOtpCode("");
      setNewPassword("");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Invalid OTP",
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
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 border-4 border-orange-50">
            <FaUserCircle size={64} />
          </div>
          <div className="mt-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {username}
            </h1>
            <p className="text-gray-500">
              Manage your personal info and security.
            </p>
          </div>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex justify-center md:justify-start gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "info"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "security"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/60 border border-white p-8 md:p-10 min-h-[400px]">
          {/* === TAB 1: PERSONAL INFO FORM === */}
          {activeTab === "info" && (
            <form
              onSubmit={handleUpdateProfile}
              className="max-w-2xl animate-fade-in-up"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <FaUserCircle className="text-orange-500" /> Edit Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:border-orange-400 focus-within:bg-white transition-all">
                    <FaUserCircle className="text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleInfoChange}
                      className="bg-transparent w-full outline-none text-gray-800 font-small"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:border-orange-400 focus-within:bg-white transition-all">
                    <FaPhone className="text-gray-400" />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleInfoChange}
                      placeholder="+62..."
                      className="bg-transparent w-full outline-none text-gray-800 font-small"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                    Email Address{" "}
                    <span className="text-orange-300 text-[10px]">
                      (Contact support to change)
                    </span>
                  </label>
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 cursor-not-allowed">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="text"
                      value={profileForm.email}
                      disabled
                      className="bg-transparent w-full outline-none text-gray-800 font-small cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                    Shipping Address
                  </label>
                  <div className="flex items-start gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:border-orange-400 focus-within:bg-white transition-all">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <textarea
                      name="address"
                      value={profileForm.address}
                      onChange={handleInfoChange}
                      rows="3"
                      placeholder="Street, City, Zip Code"
                      className="bg-transparent w-full outline-none text-gray-800 font-small resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </form>
          )}

          {/* === TAB 2: SECURITY (OTP FLOW) === */}
          {activeTab === "security" && (
            <div className="max-w-md animate-fade-in-up">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-800">
                <FaShieldAlt className="text-orange-500" /> Security
              </h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                To protect your account, we require email verification via OTP
                before changing your password.
              </p>

              {/* FLOW STEP 1: REQUEST OTP */}
              {otpStep === 1 && (
                <div className="bg-orange-50 border border-orange-100 p-8 rounded-3xl text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4 shadow-sm">
                    <FaLock size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 px-4">
                    Click the button below to receive a 6-digit OTP code in your
                    email.
                  </p>
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:opacity-70 active:scale-95 cursor-pointer"
                  >
                    {loading ? "Sending Email..." : "Send OTP Code"}
                  </button>
                </div>
              )}

              {/* FLOW STEP 2: INPUT OTP & PASSWORD BARU */}
              {otpStep === 2 && (
                <form onSubmit={handleSubmitPass} className="space-y-6">
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2 animate-pulse">
                    <FaEnvelope /> OTP has been sent to your email!
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                      Enter OTP Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="XXXXXX"
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-center text-2xl font-bold tracking-[0.5em] text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      maxLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 pl-1">
                      New Password
                    </label>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-orange-400 focus-within:bg-white transition-all">
                      <FaKey className="text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 5 characters"
                        className="bg-transparent w-full outline-none text-gray-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-70 active:scale-95 cursor-pointer"
                    >
                      {loading ? "Verifying..." : "Confirm & Change Password"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="w-full text-gray-400 hover:text-gray-600 text-sm font-bold py-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
