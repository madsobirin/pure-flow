import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="relative mb-6">
      <FiSearch
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Cari latihan..."
        className="
          w-full
          rounded-full
          border
          border-gray-200
          bg-white
          py-3
          pl-12
          pr-4
          text-sm
          text-gray-700
          outline-none
          transition-all
          placeholder:text-gray-400
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-100
        "
      />
    </div>
  );
}
