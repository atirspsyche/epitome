import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Heroicon for the burger:
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Your static assets under /static/images (served at /images/…):
import logoIcon from "../images/epitome-logo-icon.png";

gsap.registerPlugin(ScrollTrigger);

const MainLanding = () => {
  const bgVidRef = useRef(null);
  const overlayRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryInnerRef = useRef(null);
  const featuredRef = useRef(null);
  const videosInnerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // gsap.to(bgVidRef.current, {
    //   opacity: 1,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: overlayRef.current,
    //     start: "bottom top", // when overlay’s bottom reaches viewport top
    //     end: "bottom top", // same point, so it only fires once
    //     toggleActions: "play reverse play reverse",
    //   },
    // });

    // ——————————————
    // (A) “Curtain-Up” Animation for the White Overlay (with Logo inside)
    // ——————————————

    gsap.to(overlayRef.current, {
      yPercent: -100,
      ease: "power2.out",
      scrollTrigger: {
        trigger: overlayRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,

        onUpdate: (self) => {
          // When the bottom of the overlay hits the top of the viewport,
          // toggle the header's bg to black
          // if (self.progress >= 1) {
          //   console.log("hitting this");
          //   bgVidRef.current.classList.remove("opacity-0");
          // } else if (self.progress < 1) {
          //   bgVidRef.current.classList.add("opacity-0");
          // }
          // fade in header video between 80% and 100% of this scroll
          const raw = self.progress; // 0 → 1
          const fadeStart = 0.95; // start fading at 80%
          const fadeRange = 1 - fadeStart; // last 20% of scroll
          let opacity = (raw - fadeStart) / fadeRange;
          opacity = Math.min(Math.max(opacity, 0), 1); // clamp 0→1

          bgVidRef.current.style.opacity = opacity;
        },
      },
    });

    const galleryEl = galleryRef.current;
    const innerEl = galleryInnerRef.current;

    if (galleryEl && innerEl) {
      // Calculate how far the inner container must move to the left
      const totalScrollWidth = innerEl.scrollWidth - window.innerWidth;

      gsap.to(innerEl, {
        x: -totalScrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: galleryEl,
          start: "top top",
          end: () => `+=${innerEl.scrollWidth}`, // scroll distance = full width of inner
          scrub: true,
          pin: true,
          pinSpacing: false,
        },
      });
    }

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 4× viewport pin so we have room for A→B, B→C, C→D, then release:
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top-=80 top",
          end: "+=200%", // 2× viewport height
          scrub: true,
          pin: true,
        },
      });

      // Step 1 (0% → 100% scroll): bring in B over A
      tl.to(
        featuredRef.current.querySelector("video:nth-child(2)"), // B
        {
          xPercent: 90, // from -100% → 0% (covering A)
          duration: 1,
          ease: "none",
        },
        0 // at timeline position 0
      );

      // Step 2 (100% → 200%): bring in C over B
      tl.to(
        featuredRef.current.querySelector("video:nth-child(3)"), // C
        {
          xPercent: 80, // from -100% → 0%
          duration: 1,
          ease: "none",
        },
        1 // at timeline position 1 (i.e. after B finished)
      );

      // Step 3 (200% → 300%): bring in D over C
      tl.to(
        featuredRef.current.querySelector("video:nth-child(4)"), // D
        {
          xPercent: 70,
          duration: 1,
          ease: "none",
        },
        2 // at timeline position 2
      );

      // You could add a 4th tween if you want a little pause from 300% → 400%.
    });

    return () => ctx.revert();
  }, []);
  return (
    <main className="relative overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 h-20 overflow-hidden transition-colors duration-300">
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
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          {/* Left: text logo */}
          <img
            src="/images/logo_type_w.png"
            alt="Logo Text"
            className="h-8 sm:h-10"
          />

          {/* Right: burger icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-50 text-white focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="w-8 h-8 text-white cursor-pointer" />
            ) : (
              <Bars3Icon className="w-8 h-8 text-white cursor-pointer" />
            )}
          </button>
        </div>
      </header>

      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/bg-vid.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-start">
          <ul className="text-white text-9xl font-['Helvetica'] font-semibold pl-20 space-y-8">
            <li>
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
            </li>
            <li>
              <a href="#work" onClick={() => setMenuOpen(false)}>
                Work
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* ——————————————————————————————
          (3) WHITE OVERLAY “CURTAIN” (z-10)
            Contains the centered logo which scrolls off with the curtain
      —————————————————————————————— */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-10 flex justify-center items-center"
      >
        {/* Centered logo */}
        <img
          src="/images/logo_mark_w.png"
          alt="Main Logo"
          className="w-80 sm:w-96 md:w-3/12"
        />
      </div>

      {/* ——————————————————————————————
          (4) SPACER: room for the curtain to lift
            Because the header is 80px tall (h-20), we add that here.
      —————————————————————————————— */}
      <div className="h-screen z-0 relative" />

      {/* ————————————————————————————————————————————————
          (5) ALL CONTENT BELOW THIS POINT SHOULD START 80px (h-20) BELOW THE HEADER
      ———————————————————————————————————————————————— */}
      <div className="pt-20">
        {/* 20 = header height (h-20) */}

        <section
          ref={featuredRef}
          id="featured-wrapper"
          className="relative w-screen h-screen overflow-hidden bg-gray-50"
        >
          <div className="relative z-50 w-full py-12 px-8 bg-gray-50">
            <h2 className="font-heading font-semibold text-[5rem] sm:text-[6rem] leading-none text-ellipsis">
              YOU DON'T KNOW US? WE THE BEST BRO
            </h2>
          </div>

          {/* (2) Below “What I Do”: two-column layout */}
          <div className="absolute w-11/12 inset-0">
            {/* VIDEO A: starts onscreen */}

            <video
              src="/videos/v1.mp4"
              className="absolute inset-0 w-full h-full object-cover z-10 rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* VIDEO B: start off to the left */}
            <video
              src="/videos/v2.mp4"
              className="absolute inset-0 w-full h-full object-cover z-20"
              style={{ transform: "translateX(-100%)" }}
              autoPlay
              loop
              muted
              playsInline
            />

            {/* VIDEO C: also off to the left */}
            <video
              src="/videos/v3.mp4"
              className="absolute inset-0 w-full h-full object-cover z-30"
              style={{ transform: "translateX(-100%)" }}
              autoPlay
              loop
              muted
              playsInline
            />

            {/* VIDEO D: off to the left, on top of C in stacking order */}
            <video
              src="/videos/v4.mp4"
              className="absolute inset-0 w-full h-full object-cover z-40"
              style={{ transform: "translateX(-100%)" }}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="absolute bottom-16 right-20 -translate-y-1/2 z-50">
            <h3 className="font-heading font-semibold text-[3rem] sm:text-[4rem] leading-none text-ellipsis rotate-90 origin-bottom-right ">
              FEATURED WORK
            </h3>
          </div>
        </section>

        {/* (5c) FOOTER */}
        {/* (New Section Before Footer) */}
        <section className="w-full py-24 px-8 bg-gray-50">
          <h2 className="text-6xl font-semibold uppercase font-sans tracking-tight text-center text-ellipsis">
            Let's Build Something Great
          </h2>
          <h3 className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 text-center leading-relaxed">
            Whether you're looking to collaborate, hire, or just say hello — I'm
            always open to discussing exciting opportunities and ideas.
          </h3>
        </section>

        <footer className="w-full bg-gray-50 text-ellipsis py-24 px-12">
          <div className="flex flex-col justify-center space-y-8">
            <a
              href="#about"
              className="text-5xl font-bold hover:opacity-80 transition-all duration-300"
            >
              INSTAGRAM
            </a>
            <a
              href="#work"
              className="text-5xl font-bold hover:opacity-80 transition-all duration-300"
            >
              FACEBOOK
            </a>
            <a
              href="#contact"
              className="text-5xl font-bold hover:opacity-80 transition-all duration-300"
            >
              TWITTER
            </a>
            <a
              href="#blog"
              className="text-5xl font-bold hover:opacity-80 transition-all duration-300"
            >
              EMAIL
            </a>
            <img src="/images/logo_1f.png" className="w-96" />
          </div>
        </footer>
      </div>
    </main>
  );
};

export default MainLanding;
