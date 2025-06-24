import React, { useRef, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "gatsby";

gsap.registerPlugin(ScrollTrigger);

const brandList = [
  "Brand 1",
  "Brand 2",
  "Brand 3",
  "Brand 4",
  "Brand 5",
  "Brand 6",
  "Brand 7",
];

function AllWork() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
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
    gsap.fromTo(
      ".brand-list",
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "back.out(0.2)", // softer rebound
        duration: 1, // quicker settle
        stagger: 0.05, // tighter sequence
      }
    );
    return () => {};
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden transition-colors duration-300">
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <a href="/">
            <img
              src="/images/logo_combination.png"
              alt="Logo Text"
              className="h-10 sm:h-14 hover:opacity-70 transition-opacity duration-500 ease-in-out"
            />
          </a>

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
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/v2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="fixed inset-10 z-10 flex justify-start items-end">
        <ul className="text-white text-2xl md:text-5xl font-heading font-semibold ">
          {brandList.map((el, i) => (
            <li className="brand-list">
              <Link
                className="opacity-30 transition-all duration-500 transform  md:hover:opacity-100 md:hover:text-6xl "
                to="/work/brand1"
              >
                {el}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default AllWork;
