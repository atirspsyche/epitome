import React, { useRef, useEffect, useState } from "react";

export default function Footer() {
  return (
    <footer className="w-full py-16 pb-8 px-8 text-white font-heading">
      <div className="grid grid-cols-2 w-full gap-y-8">
        {/* Row 1–4: Left and Right aligned links */}
        <a
          href="https://wa.me/7400368811"
          className="w-auto text-3xl md:text-7xl font-normal col-start-1 text-left hover:opacity-30 transition-all duration-500 hover:text-[5rem] "
          target="_blank"
          rel="noopener noreferrer"
        >
          7400368811
        </a>
        <a
          href="#about"
          className=" text-xs self-end font-semibold col-start-2 text-right hover:opacity-80 transition-all duration-300"
        >
          @yourhandle
        </a>

        <a
          href="mailto:hello@yourdomain.com"
          className="text-3xl md:text-7xl font-normal col-start-1 text-left hover:opacity-30 transition-all duration-500 hover:text-[5rem]"
        >
          TEMP@GMAIL.COM
        </a>
        <a
          href="#work"
          className="text-xs self-end font-semibold col-start-2 text-right hover:opacity-80 transition-all duration-300"
        >
          fb.com/yourpage
        </a>

        <a
          href="#contact"
          className="text-3xl md:text-7xl font-normal col-start-1 text-left hover:opacity-30 transition-all duration-500 hover:text-[5rem]"
        >
          TWITTER
        </a>
        <a
          href="#contact"
          className="text-xs self-end font-semibold col-start-2 text-right hover:opacity-80 transition-all duration-300"
        >
          @yourtwitter
        </a>

        <a
          href="#blog"
          className="text-3xl md:text-7xl font-normal col-start-1 text-left hover:opacity-30 transition-all duration-500 hover:text-[5rem]"
        >
          EMAIL
        </a>
        <a
          href="#blog"
          className="text-xs self-end font-semibold col-start-2 text-right hover:opacity-80 transition-all duration-300"
        >
          hello@example.com
        </a>

        {/* Divider Line */}
        <div className="col-span-2 self-center">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-lightNeutral to-transparent" />
          </div>
        </div>

        {/* Row 6: 3 columns with vertical dividers */}

        {/* Row 7: Centered Logo */}
        <div className="col-span-2 flex justify-center">
          <img src="/images/logomark_w.svg" className="w-24 mt-2" alt="Logo" />
        </div>
      </div>
    </footer>
  );
}
