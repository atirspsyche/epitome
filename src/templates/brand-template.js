import React, { useRef, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/footer";
import NavMenu from "../components/menu";
import BrandShowcase from "../components/brand-showcase";

gsap.registerPlugin(ScrollTrigger);

export default function BrandPage({ pageContext }) {
  const brand = pageContext;
  const [menuOpen, setMenuOpen] = useState(false);
  const bgVidRef = useRef();

  // Lazy video play/pause for any data-lazy videos (gallery videos in BrandShowcase)
  useEffect(() => {
    const videos = document.querySelectorAll("video[data-lazy]");
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.paused) video.play().catch(() => {});
          } else {
            if (!video.paused) video.pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    videos.forEach((v) => observer.observe(v));
    return () => videos.forEach((v) => observer.unobserve(v));
  }, []);

  // Menu animation
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        ".menu-item",
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "back.out(1.7)",
          duration: 0.5,
          stagger: 0.15,
        }
      );
    } else {
      gsap.to(".menu-item", { opacity: 0, y: -50, duration: 0.2 });
    }
  }, [menuOpen]);

  // Custom cursor
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;
    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!brand) return <div>Brand not found</div>;

  return (
    <main className="relative cursor-none">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden transition-colors duration-300 bg-gradient-to-r from-secondary via-transparent to-secondary">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          src="/videos/header-sprinkles.mp4"
          ref={bgVidRef}
          data-lazy="true"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="relative flex z-10 items-center justify-between h-full px-8">
          <a href="/">
            <img
              src="/images/logo_combination.png"
              alt="Logo Text"
              className="h-10 sm:h-14 hover:opacity-70 transition-opacity duration-500 ease-in-out"
            />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-10 h-10 focus:outline-none"
          >
            <Bars3Icon
              className={`absolute inset-0 w-full h-full text-primary transition-opacity duration-500 ease-in-out ${
                menuOpen
                  ? "opacity-0 scale-75 rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />
            <XMarkIcon
              className={`absolute inset-0 w-full h-full text-primary transition-opacity duration-500 ease-in-out ${
                menuOpen
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-75 rotate-45"
              }`}
            />
          </button>
        </div>
      </header>
      <NavMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <BrandShowcase brand={brand} />
      <div className="relative">
        <Footer />
      </div>
    </main>
  );
}
