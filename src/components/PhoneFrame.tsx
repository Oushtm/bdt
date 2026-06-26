'use client';

import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

/**
 * On mobile: children fill the entire screen.
 * On desktop (sm+): children appear inside a 390×844px centered phone shell.
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    /* Desktop shell */
    <div className="min-h-screen w-full flex items-center justify-center
                    bg-gradient-to-br from-[#f0d6f5] via-[#fce4ec] to-[#e8d5ff]
                    sm:p-8">
      {/* Phone container */}
      <div
        className="
          relative overflow-hidden
          w-full h-screen
          sm:w-[390px] sm:h-[844px]
          sm:rounded-[48px]
          sm:shadow-[0_40px_120px_rgba(180,120,200,0.4),0_0_0_1px_rgba(255,255,255,0.3)]
          sm:border sm:border-white/30
          bg-[#FFF8FC]
        "
      >
        {children}
      </div>
    </div>
  );
}
