import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/footer";

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
  const [showSplash, setShowSplash] = useState(true);
  const splashRef = useRef(null);

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
      const totalScrollWidth =
        innerEl.scrollWidth - window.innerWidth + 0.2 * innerEl.scrollWidth;

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
    // only run the mobile reveal on small screens
    if (window.innerWidth < 768) {
      gsap.utils.toArray(".mobile-video").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }
  }, []);
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
    const ctx = gsap.context(() => {
      // 4× viewport pin so we have room for A→B, B→C, C→D, then release:
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top top",
          end: "+=200%", // 2× viewport height
          scrub: true,
          pin: true,
        },
      });

      // Step 1 (0% → 100% scroll): bring in B over A
      tl.to(
        featuredRef.current.querySelector("video:nth-child(2)"), // B
        {
          xPercent: 95, // from -100% → 0% (covering A)
          duration: 1,
          ease: "none",
        },
        0 // at timeline position 0
      );

      // Step 2 (100% → 200%): bring in C over B
      tl.to(
        featuredRef.current.querySelector("video:nth-child(3)"), // C
        {
          xPercent: 90, // from -100% → 0%
          duration: 1,
          ease: "none",
        },
        1 // at timeline position 1 (i.e. after B finished)
      );

      // Step 3 (200% → 300%): bring in D over C
      tl.to(
        featuredRef.current.querySelector("video:nth-child(4)"), // D
        {
          xPercent: 85,
          duration: 1,
          ease: "none",
        },
        2 // at timeline position 2
      );

      // You could add a 4th tween if you want a little pause from 300% → 400%.
    });

    return () => ctx.revert();
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
    // 1) Header scrollTrigger …
    // 2) Curtain scrollTrigger …
    // 3) Gallery scrollTrigger …

    // 4) Splash animation
    if (showSplash && splashRef.current) {
      document.body.style.overflow = "hidden";
      gsap.to(splashRef.current, {
        yPercent: -100,
        ease: "power2.inOut",
        duration: 1,
        delay: 3,
        onComplete: () => {
          setShowSplash(false);
          document.body.style.overflow = "";
        },
      });
    }
  }, [showSplash]);
  return (
    <main className="relative overflow-x-hidden">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      {showSplash && (
        <div
          ref={splashRef}
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
        >
          <img src="/images/logomark.svg" alt="Splash Logo" className="w-80" />
        </div>
      )}

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
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          {/* Left: text logo */}
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

      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/bg-vid.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

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

      {/* ——————————————————————————————
          (3) WHITE OVERLAY “CURTAIN” (z-10)
            Contains the centered logo which scrolls off with the curtain
      —————————————————————————————— */}
      <div
        ref={overlayRef}
        className="fixed inset-10 z-10 flex justify-center items-center"
      >
        {/* Centered logo */}
        <img
          src="/images/logomark_w.svg"
          alt="Main Logo"
          className="w-80 sm:w-96 md:w-5/12"
        />
      </div>

      <div className="h-screen z-0 relative" />

      <div className="pt-20">
        <section id="featured-wrapper" className="w-screen bg-[#111111]">
          <div className="w-full pt-12 px-8">
            <h2
              className="
                        font-heading font-semibold
                        text-[2rem] sm:text-[2rem] lg:text-[5rem]
                        leading-tight
                        text-left
                        bg-clip-text text-transparent
                        bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb]
                        "
            >
              YOU DON'T KNOW US? WE'RE THE BEST, BRO.
            </h2>
          </div>
          <div className="w-full text-right text-xs text-white pb-12 px-8 mt-5 md:mt-0">
            LEARN MORE
          </div>

          <div className="relative py-1">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-lightNeutral to-transparent" />
          </div>
          <div className="block md:hidden px-4 py-12">
            <h2 className="text-5xl font-heading font-semibold text-center mb-8  bg-gradient-to-r from-lightNeutral to-secondary bg-clip-text text-transparent">
              FEATURED
            </h2>
            <div className="space-y-8">
              {[
                "/videos/v1.mp4",
                "/videos/v2.mp4",
                "/videos/v3.mp4",
                "/videos/v4.mp4",
              ].map((src, i) => (
                <div
                  key={i}
                  className="mobile-video relative rounded-3xl overflow-hidden h-64"
                >
                  <video
                    src={src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded">
                    Project {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="hidden md:grid grid-cols-1 md:grid-cols-7 h-screen"
            ref={featuredRef}
          >
            {/* Col A: Videos (takes the left 50% on md+) */}
            <div className="relative overflow-hidden md:col-span-6 h-4/5 mt-40">
              {/*… your existing absolute‐stacked video JS (videosInnerRef) goes here …*/}
              <div className="absolute w-full inset-0 ">
                {/* VIDEO A: starts onscreen */}

                <video
                  src="/videos/v1.mp4"
                  className="absolute inset-0 w-full h-full object-cover z-10 rounded-3xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* VIDEO B: start off to the left */}
                <video
                  src="/videos/v2.mp4"
                  className="absolute inset-0 w-full h-full object-cover z-20 rounded-3xl"
                  style={{ transform: "translateX(-100%)" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* VIDEO C: also off to the left */}
                <video
                  src="/videos/v3.mp4"
                  className="absolute inset-0 w-full h-full object-cover z-30 rounded-3xl"
                  style={{ transform: "translateX(-100%)" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* VIDEO D: off to the left, on top of C in stacking order */}
                <video
                  src="/videos/v4.mp4"
                  className="absolute inset-0 w-full h-full object-cover z-40 rounded-3xl"
                  style={{ transform: "translateX(-100%)" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* Col B: Featured Work text (right 50%) */}
            <div className="flex items-end justify-center px-8 md:col-span-1 h-4/5 mt-40">
              <h3
                className="
                          font-heading font-semibold
                          text-[7rem] sm:text-[8rem] leading-tight
                          bg-gradient-to-b from-lightNeutral to-secondary
                          bg-clip-text text-transparent
                          [writing-mode:vertical-rl] [text-orientation:sideways-right] [direction:ltr]
                          "
              >
                FEATURED
              </h3>
            </div>
          </div>
        </section>
        {/* (5c) FOOTER */}
        {/* (New Section Before Footer) */}
        <section className="w-full py-5 px-8 bg-[#111111]">
          <div className="w-full">
            <h2
              className="
                        font-heading font-semibold
                        text-[2.5rem] sm:text-[5rem] lg:text-[6rem]
                        leading-tight
                        text-left
                        bg-clip-text text-transparent
                        bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb]
                        "
            >
              {String("Other Works").toUpperCase()}
            </h2>
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-lightNeutral to-secondary my-4" />

          <section id="other-works" className="w-full py-10 ">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-6">
              <div className="relative rounded-xl overflow-hidden md:col-span-2 md:row-span-4">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 1
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-3">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 2
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-2">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 3
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 mt-20">
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-2">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 1
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-2 md:row-span-3">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 2
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-2">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 3
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 mt-20">
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-1">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 1
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-2 md:row-span-3">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 2
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-1">
                <div className="absolute top-0 left-0 bg-black/60 text-white text-sm font-medium px-3 py-1 z-10">
                  Project 3
                </div>
                <video
                  className="w-full h-full object-cover"
                  src={`/videos/v1.mp4`} // Rotating sample videos
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
            <div className="w-full text-right text-xs text-white mt-5 md:mt-0">
              SHOW ALL
            </div>
          </section>
          {/* <div className="grid grid-cols-2 divide-x divide-gray-400 mt-5">
            <div className="flex flex-col items-left justify-center p-8">
              <h2 className="text-white text-3xl font-heading font-bold mb-4">
                Some Heading
              </h2>
              <p className="text-white text-lg text-left">
                Some content goes here
              </p>
            </div>

            <div className="flex flex-col items-left justify-center p-8">
              <h2 className="text-white text-3xl font-heading font-bold mb-4">
                Some Heading2
              </h2>
              <p className="text-white text-lg text-left">
                Some content2 goes here
              </p>
            </div>
          </div> */}
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default MainLanding;
