import React, { useRef, useEffect, useState, useCallback } from "react";

import { Link } from "gatsby";

export default function NotFoundPage() {
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    // Only show custom cursor on desktop (768px and above)
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      cursor.style.display = "none";
      return;
    }

    cursor.style.display = "block";

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handleResize = () => {
      const isMobileResize = window.innerWidth < 768;
      cursor.style.display = isMobileResize ? "none" : "block";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="min-h-screen w-screen bg-black text-white flex items-center justify-center">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />

      <div className="max-w-3xl w-full px-6 py-12 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/images/logomark_w.svg"
            alt="Site logo"
            className="w-24 h-24 animate-pulse-slow"
            style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.6))" }}
          />

          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-none">
              404
            </h1>
            <p className="mt-2 text-gray-300 tracking-wider">Page not found</p>
          </div>
        </div>

        <div className="w-full bg-[#0b0b0b] border border-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
          <p className="text-center text-gray-400 max-w-xl">
            The page you're looking for doesn't exist — maybe it moved, or maybe
            you typed the URL wrong. Try one of these:
          </p>

          {/* Action buttons */}
          <div className="flex gap-4 mt-2">
            <Link
              to="/"
              className="px-5 py-2 rounded-md bg-white text-black font-medium hover:opacity-90 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/allworks"
              className="px-5 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-900 transition"
            >
              View Work
            </Link>
          </div>

          <div className="mt-4 w-full max-w-xl">
            <div
              className="h-1 bg-gray-800 rounded overflow-hidden"
              aria-hidden="true"
            >
              <div className="h-full bg-white loading-glow" />
            </div>
            <div className="mt-2 text-xs text-gray-500 tracking-widest text-center">
              TRY A DIFFERENT PATH — /work/about/about
            </div>
          </div>
        </div>

        {/* Small footer */}
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">©</span>{" "}
          <span className="text-gray-400">Epitome</span>{" "}
          <span className="text-gray-500">•</span>{" "}
          <Link to="/" className="underline text-gray-300">
            Home
          </Link>
        </div>
      </div>

      <style>{`
        /* pulse-slow for the logo */
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2.2s infinite ease-in-out;
        }

        /* loading bar shimmer */
        @keyframes loadingGlide {
          0% { transform: translateX(-110%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(110%); }
        }
        .loading-glow {
          width: 30%;
          transform: translateX(-110%);
          opacity: 0.9;
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.06) 100%);
          animation: loadingGlide 3s cubic-bezier(.2,.8,.2,1) infinite;
        }

        /* Slight responsive tweaks */
        @media (max-width: 640px) {
          h1 { font-size: 3.2rem; }
        }
      `}</style>
    </div>
  );
}
export const Head = () => (
  <>
    <title>Digital | Epitome</title>;
  </>
);
