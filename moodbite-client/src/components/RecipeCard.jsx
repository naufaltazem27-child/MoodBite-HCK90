import { FaClock, FaFire, FaLeaf } from "react-icons/fa";

export default function RecipeCard({ recipe, children, moodLabel }) {
  // Helper: Membersihkan string angka (misal "300 kcal" jadi "300")
  const cleanNum = (val) => {
    if (!val) return "-";
    // Ambil angka dan titik saja
    return val.toString().replace(/[^0-9.]/g, "");
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/60 border border-white overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-1 group">
      {/* IMAGE SECTION (Lebih Besar: h-56 / 14rem / 224px) */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img
          src={recipe.imageUrl || recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Delicious+Food";
          }}
        />

        {/* Badge Waktu (Pojok Kanan Atas) */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1 text-gray-700">
          <FaClock className="text-orange-500" /> {recipe.readyInMinutes}m
        </div>

        {/* Badge Mood (Pojok Kiri Atas - Opsional jika props ada) */}
        {moodLabel && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-md text-orange-600 uppercase tracking-wide">
            {moodLabel}
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-4 line-clamp-2 min-h-[3.5rem]">
          {recipe.title}
        </h2>

        {/* Nutrition Grid (Style Rapi ala Recommendation Page) */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Calories */}
          <div className="bg-orange-50 p-2.5 rounded-2xl text-center border border-orange-100">
            <p className="text-[10px] text-orange-400 font-bold uppercase mb-1">
              <FaFire className="inline" /> Kcal
            </p>
            <p className="text-xs font-bold text-gray-800">
              {cleanNum(recipe.calories)}
            </p>
          </div>

          {/* Protein */}
          <div className="bg-green-50 p-2.5 rounded-2xl text-center border border-green-100">
            <p className="text-[10px] text-green-500 font-bold uppercase mb-1">
              <FaLeaf className="inline" /> Prot
            </p>
            <p className="text-xs font-bold text-gray-800">
              {cleanNum(recipe.protein)}
            </p>
          </div>

          {/* Fat */}
          <div className="bg-yellow-50 p-2.5 rounded-2xl text-center border border-yellow-100">
            <p className="text-[10px] text-yellow-600 font-bold uppercase mb-1">
              Fat
            </p>
            <p className="text-xs font-bold text-gray-800">
              {cleanNum(recipe.fat)}
            </p>
          </div>
        </div>

        {/* Spacer agar tombol selalu di bawah */}
        <div className="flex-grow"></div>

        {/* Action Buttons (Dimasukkan dari Parent) */}
        <div className="flex gap-3 mt-2">{children}</div>
      </div>
    </div>
  );
}
