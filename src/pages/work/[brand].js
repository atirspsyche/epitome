import React, { useRef, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function Work({ params }) {
  const { brand } = params;
  const [menuOpen, setMenuOpen] = useState(false);
  const bgVidRef = useRef();

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        ".menu-item",
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "back.out(1.7)", // softer rebound
          duration: 0.5, // quicker settle
          stagger: 0.15, // tighter sequence
        }
      );
    } else {
      // On close, reset for next open
      gsap.to(".menu-item", { opacity: 0, y: -50, duration: 0.2 });
    }
  }, [menuOpen]);
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <main className="relative overflow-x-hidden cursor-none">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden transition-colors duration-300">
        {/* Background video inside header (fills the 80px / h-20 height) */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          src="/videos/header-sprinkles.mp4"
          ref={bgVidRef}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Overlay on top of video for slight darkening (optional) */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}

        {/* Header content (logo text + burger) */}
        <div className="relative flex z-10 items-center justify-between h-full px-8">
          {/* Left: text logo */}
          <img
            src="/images/logo_combination.png"
            alt="Logo Text"
            className="h-10 sm:h-14 hover:opacity-70 transition-opacity duration-500 ease-in-out"
          />
          {/* <a href="/">
          </a> */}

          {/* Right: burger icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-10 h-10 focus:outline-none"
          >
            {/* Hamburger */}
            <Bars3Icon
              className={`absolute inset-0 w-full h-full text-white transition-opacity duration-500 ease-in-out ${
                menuOpen
                  ? "opacity-0 scale-75 rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />

            {/* Close */}
            <XMarkIcon
              className={`absolute inset-0 w-full h-full text-white transition-opacity duration-500 ease-in-out ${
                menuOpen
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-75 rotate-45"
              }`}
            />
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/90 flex items-center justify-start">
          <ul className="menu-items text-white text-5xl md:text-7xl sm:text-5xl font-['Helvetica'] font-normal pl-8 space-y-8">
            {[
              { name: "HOME", link: "/" },
              { name: "RECENT", link: "/recent" },
              { name: "WORK", link: "/allworks" },
              { name: "ABOUT", link: "/about" },
            ].map((item, i) => (
              <li key={item.name} className="menu-item opacity-0">
                <a
                  className="transition-all duration-500 transform hover:opacity-30 md:hover:text-8xl"
                  href={item.link}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-auto"
        src="/videos/bg-vid.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls
      />
      {/* <div className="fixed inset-10 z-10 flex justify-start items-end text-white">
        <div className="grid md:grid-rows-3 font-heading gap-5 w-full ">

          <div className="uppercase font-heading font-semibold text-3xl md:text-5xl leading-tight text-left bg-clip-text text-transparent bg-gradient-to-tr from-slate-400 to-white">
            <h1>Something Slick</h1>
          </div>
          <div className="text-xl md:text-2xl">
            <h1>Subtitle</h1>
          </div>
          <div>
            <h1>Pagination / somethi / somethin</h1>
          </div>
        </div>
      </div> */}
      <div className="h-[90vh] z-10 relative text-white px-8 py-8">
        <div className="flex flex-col justify-end font-heading gap-5 w-full h-full">
          <div className="uppercase font-semibold text-3xl md:text-5xl leading-tight text-left bg-clip-text text-transparent bg-gradient-to-tr from-slate-400 to-white">
            Something Slick
          </div>
          <div className="text-xl md:text-2xl font-semibold">Subtitle</div>
          <div className="font-semibold">Pagination / somethi / somethin</div>
        </div>
      </div>
      <div className="h-[10vh] -z-10 relative"></div>

      <div className="relative grid md:grid-cols-2 bg-white z-10">
        <div>some</div>
        <div>some</div>
      </div>
    </main>
  );
}

export default Work;
