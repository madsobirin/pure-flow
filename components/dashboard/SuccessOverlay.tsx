"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface SuccessOverlayProps {
  message: string;
}

export default function SuccessOverlay({ message }: SuccessOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center max-w-xs w-full shadow-2xl border border-gray-100"
      >
        {/* Lingkaran Ikon Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 200,
            delay: 0.1,
          }}
          className="w-20 h-20 bg-[#ccfbf1] rounded-full flex items-center justify-center mb-6 text-brand-teal shadow-[0_8px_24px_rgba(13,148,136,0.15)]"
        >
          <Check className="w-10 h-10" strokeWidth={3.5} />
        </motion.div>

        {/* Judul & Pesan */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sukses!</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
