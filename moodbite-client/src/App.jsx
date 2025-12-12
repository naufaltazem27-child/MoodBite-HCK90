export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      {/* Test Font & Warna */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-mood-800 drop-shadow-sm">
          MoodBite 😋
        </h1>
        <p className="text-xl text-fresh-dark font-semibold">
          Good Food, Good Mood.
        </p>
      </div>

      {/* Test Button Styling */}
      <div className="flex gap-4">
        <button className="bg-mood-500 hover:bg-mood-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105 cursor-pointer">
          Mulai Sekarang
        </button>
        <button className="bg-white border-2 border-mood-500 text-mood-700 px-8 py-3 rounded-full font-bold hover:bg-mood-50 transition cursor-pointer">
          Login Staff
        </button>
      </div>

      {/* Test Card & Shadow */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-fresh-green max-w-sm">
        <h3 className="text-2xl font-bold mb-2">Setup Berhasil! 🎉</h3>
        <p className="text-gray-600">
          Tailwind v4 sudah aktif. Font Quicksand sudah terpasang. Siap coding!
        </p>
      </div>
    </div>
  );
}
