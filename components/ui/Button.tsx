"use client";
import { Moon } from "lucide-react";

const Buttonn = () => {
  return (
    <div>
      <button
        onClick={() => {
          alert("Fitur ini belum tersedia.");
        }}
        className="text-gray-700 hover:text-gray-900 hover:scale-105 transition-all duration-200 focus:outline-none"
      >
        <Moon className="w-6 h-6" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default Buttonn;
