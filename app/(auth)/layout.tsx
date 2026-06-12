import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4 md:p-8 font-sans transition-colors duration-300">
      {/* Container - Styled like a beautiful elegant mock smartphone wrapper on desktop */}
      <div
        id="app_frame"
        className="w-full max-w-md bg-[#faf9f6] md:bg-white md:shadow-2xl md:shadow-gray-100/80 md:border md:border-gray-100 md:rounded-[40px] overflow-hidden relative min-h-[820px] flex flex-col justify-between py-8 px-6 md:px-8"
      >
        {/* Subtle decorative elements for the desktop phone layout */}
        <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-100 rounded-full z-30" />

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col justify-start">{children}</div>

        {/* Brand footers */}
        <div className="text-center text-[11px] text-[#71777f] font-medium tracking-tight mt-6 select-none opacity-80">
          <p className="flex items-center justify-center gap-1">
            <span>Metode otentikasi aman terenkripsi</span>
          </p>
        </div>
      </div>
    </div>
  );
}
