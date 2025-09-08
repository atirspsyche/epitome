import React, { useRef, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "gatsby";
import NavMenu from "../../../components/menu";

import brandList from "../../../data/motion-brand-list.json";

gsap.registerPlugin(ScrollTrigger);

function AllWork() {
  const [menuOpen, setMenuOpen] = useState(false);
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
  // useEffect(() => {
  //   if (menuOpen) {
  //     gsap.fromTo(
  //       ".menu-item",
  //       { y: -50, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         ease: "back.out(1.7)",
  //         duration: 0.5,
  //         stagger: 0.15,
  //       }
  //     );

  //     gsap.fromTo(
  //       ".submenu-item",
  //       { y: -20, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         ease: "power2.out",
  //         duration: 0.4,
  //         stagger: 0.1,
  //         delay: 0.3,
  //       }
  //     );
  //   } else {
  //     gsap.to(".menu-item", { opacity: 0, y: -50, duration: 0.2 });
  //     gsap.to(".submenu-item", { opacity: 0, y: -20, duration: 0.2 });
  //   }
  // }, [menuOpen]);
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
      <NavMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/v3.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="fixed inset-10 z-10 flex justify-start items-end">
        <div className="text-white text-2xl md:text-5xl font-heading tracking-tighter ">
          <div className="mb-10 text-6xl">Motion</div>

          <div className="flex gap-16">
            {/* Split into two columns */}
            <ul className="flex flex-col">
              {brandList
                .slice(0, Math.ceil(brandList.length / 2))
                .map((el, i) => (
                  <li key={i} className="brand-list">
                    <Link
                      className="opacity-30 transition-all duration-500 transform md:hover:opacity-100 md:hover:text-6xl"
                      to={`/work/motion/${el.replace(/\s+/g, "")}`}
                    >
                      {el}
                    </Link>
                  </li>
                ))}
            </ul>

            <ul className="flex flex-col">
              {brandList.slice(Math.ceil(brandList.length / 2)).map((el, i) => (
                <li key={i} className="brand-list">
                  <Link
                    className="opacity-30 transition-all duration-500 transform md:hover:opacity-100 md:hover:text-6xl"
                    to={`/work/motion/${el.replace(/\s+/g, "")}`}
                  >
                    {el}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AllWork;

export const Head = () => (
  <>
    <title>Motion | Epitome</title>;
  </>
);
