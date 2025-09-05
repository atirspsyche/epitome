// src/pages/MainLanding.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/footer";
import NavMenu from "../components/menu";
// import PerformanceMonitor from "../components/performance-monitor";
import "../styles/performance.css";

// Heroicon for the burger:
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useSimpleVideoObserver from "../components/simple-video-observer";
// import useEnhancedVideoObserver from "../components/enhanced-video-observer";

gsap.registerPlugin(ScrollTrigger);

const MainLanding = () => {
  const bgVidRef = useRef(null);
  const overlayRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryInnerRef = useRef(null);
  const featuredRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const splashRef = useRef(null);

  // Video optimization - simple approach for reliability
  useSimpleVideoObserver();

  // Throttled scroll performance optimization
  useEffect(() => {
    let rafId;
    let lastScrollY = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);

        // If scrolling very fast, reduce quality temporarily
        if (scrollDelta > 100) {
          document.body.classList.add("fast-scroll");

          // Remove class after scroll settles
          clearTimeout(window.fastScrollTimeout);
          window.fastScrollTimeout = setTimeout(() => {
            document.body.classList.remove("fast-scroll");
          }, 150);
        }

        lastScrollY = currentScrollY;
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(window.fastScrollTimeout);
    };
  }, []);

  useEffect(() => {
    // Enhanced ScrollTrigger performance configuration
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 16, // ~60fps
      ignoreMobileResize: true, // Better mobile performance
    });

    // Clear all existing ScrollTriggers first
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // Throttled overlay animation
    let overlayTween = gsap.to(overlayRef.current, {
      yPercent: -100,
      ease: "power2.out",
      scrollTrigger: {
        trigger: overlayRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1, // Reduced scrub for smoother performance
        onUpdate: (self) => {
          // Throttle expensive operations
          if (self.progress > 0.95 && bgVidRef.current) {
            const opacity = Math.min(
              Math.max((self.progress - 0.95) / 0.05, 0),
              1
            );
            bgVidRef.current.style.opacity = opacity;
          }
        },
      },
    });

    // Gallery horizontal scroll with performance optimization
    const galleryEl = galleryRef.current;
    const innerEl = galleryInnerRef.current;

    let galleryTween;
    if (galleryEl && innerEl) {
      // Use requestAnimationFrame for smoother calculations
      requestAnimationFrame(() => {
        const totalScrollWidth =
          innerEl.scrollWidth - window.innerWidth + 0.2 * innerEl.scrollWidth;

        galleryTween = gsap.to(innerEl, {
          x: -totalScrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: galleryEl,
            start: "top top",
            end: () => `+=${innerEl.scrollWidth}`,
            scrub: 1, // Reduced for performance
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true, // Better responsive behavior
          },
        });
      });
    }

    return () => {
      // Proper cleanup
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (overlayTween) overlayTween.kill();
      if (galleryTween) galleryTween.kill();
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      // Use requestAnimationFrame for better mobile performance
      requestAnimationFrame(() => {
        gsap.utils.toArray(".mobile-video").forEach((el, index) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.4, // Reduced duration for better performance
            ease: "power2.out",
            delay: index * 0.1, // Stagger the animations
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true, // Only animate once for better performance
            },
          });
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

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: featuredRef.current,
  //         start: "top top",
  //         end: "+=250%",
  //         scrub: true,
  //         pin: true,
  //       },
  //     });

  //     tl.to(
  //       featuredRef.current.querySelector("video:nth-child(2)"),
  //       { xPercent: 97, duration: 1, ease: "none" },
  //       0
  //     );
  //     tl.to(
  //       featuredRef.current.querySelector("video:nth-child(3)"),
  //       { xPercent: 94, duration: 1, ease: "none" },
  //       1
  //     );
  //     tl.to(
  //       featuredRef.current.querySelector("video:nth-child(4)"),
  //       { xPercent: 91, duration: 1, ease: "none" },
  //       2
  //     );
  //     tl.to(
  //       featuredRef.current.querySelector("video:nth-child(5)"),
  //       { xPercent: 88, duration: 1, ease: "none" },
  //       3
  //     );
  //   });

  //   return () => ctx.revert();
  // }, []);

  // Enhanced featured section animation with performance optimization
  useEffect(() => {
    // nothing to do if the ref isn't mounted
    if (!featuredRef.current) return;

    // use gsap.context for automatic scoping / cleanup
    const ctx = gsap.context(() => {
      const el = featuredRef.current;
      if (!el) return; // extra-safety

      // collect cards from the mounted element
      const cards = Array.from(el.querySelectorAll(".feat-card"));
      if (!cards.length) return; // nothing to animate

      // Use will-change for better performance
      cards.forEach((card) => {
        card.style.willChange = "transform";
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=250%",
          scrub: 1, // Reduced scrub for smoother performance
          pin: true,
          anticipatePin: 1, // Better pin performance
        },
      });

      const xValues = [98, 96, 94, 92];
      cards.slice(1, 1 + xValues.length).forEach((card, i) => {
        tl.to(
          card,
          {
            xPercent: xValues[i],
            duration: 1,
            ease: "none",
            force3D: true, // Force hardware acceleration
          },
          i
        );
      });

      // Cleanup performance hints on destroy
      return () => {
        cards.forEach((card) => {
          card.style.willChange = "auto";
        });
      };
    }, featuredRef); // scope the context to the ref

    return () => {
      // cleanup
      ctx.revert();
    };
  }, []); // runs after mount

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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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

  // Enhanced resize handler with debouncing
  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      {/* Performance Monitor - temporarily disabled */}
      {/* <PerformanceMonitor showMonitor={process.env.NODE_ENV === "development"} /> */}

      {/* ======= STATIC THIN BARS (on top of everything) =======
          - 5px width each (w-[5px])
          - vertical gradient top→bottom
          - pointer-events-none so clicks pass through
          - z-50 to sit above header/content
      */}
      <div
        aria-hidden
        // className="fixed inset-y-0 left-0 w-[5px] z-50 pointer-events-none hidden sm:block"
      />
      <div
        aria-hidden
        // className="fixed inset-y-0 right-0 w-[5px] z-50 pointer-events-none hidden sm:block"
      />

      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />

      {showSplash && (
        <div
          ref={splashRef}
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
        >
          <video
            src="/videos/epi.mp4"
            className="w-1/3"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/images/epi1.png"
          />
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden transition-colors duration-300">
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

        <div
          className="relative z-10 flex items-center justify-between h-full px-8"
          style={{ marginLeft: 0, marginRight: 0 }}
        >
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

      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/bg/home.mp4"
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.loop = true;
            el.playsInline = true;
            // Only start playing after splash is done
            if (!showSplash) {
              el.play().catch(console.log);
            }
          }
        }}
      />

      <NavMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div
        ref={overlayRef}
        className="fixed inset-10 z-10 flex justify-center items-center"
      >
        <img
          src="/images/logomark_w.svg"
          alt="Main Logo"
          className="w-80 sm:w-96 md:w-7/12"
        />
      </div>

      <div className="h-screen z-0 relative" />

      <div className="pt-20">
        {/* ---------- FEATURED (with overlays, hover, click) ---------- */}
        <section id="featured-wrapper" className="w-screen bg-secondary">
          <div className="w-full pt-12 px-8">
            <h2 className="font-heading font-semibold text-[2rem] sm:text-[2rem] lg:text-[5rem] leading-tight text-primary text-left uppercase">
              Epitome is a results-driven creative production company
            </h2>
          </div>

          {/* <div className="w-full text-right text-xs text-white pb-12 px-8 mt-5 font-body md:mt-0 underline underline-offset-2">
            <a href="">LEARN MORE</a>
          </div> */}
          <div className="grid grid-cols-1 md:grid-rows-3 gap-6 mt-5 pr-5">
            <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-3 text-right">
              <div className="absolute inset-0 flex items-end justify-end p-4">
                <a
                  href="/about"
                  className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded backdrop-blur-sm transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-hanBlue to-transparent" />
          </div>

          {/* MOBILE LIST (keeps same behaviour) */}
          <div className="block md:hidden px-4 py-12">
            <h2 className="text-5xl font-heading font-semibold text-center mb-8 text-primary">
              FEATURED
            </h2>
            <div className="space-y-8">
              {[
                {
                  src: "/videos/featured/akshat.mp4",
                  title: "BPFT 2025",
                  subtitle: "Brand Film",
                  href: "/work/BPFT2025",
                },
                {
                  src: "/videos/featured/oaken.mp4",
                  title: "Oaken",
                  subtitle: "Product",
                  href: "/work/oaken",
                },
                {
                  src: "/videos/featured/dzire.mp4",
                  title: "Dzire",
                  subtitle: "Commercial",
                  href: "/work/dzire",
                },
                {
                  src: "/videos/featured/ballentines.mp4",
                  title: "Ballentines",
                  subtitle: "TVC",
                  href: "/work/ballentines",
                },
                {
                  src: "/videos/featured/kingfisher.mp4",
                  title: "Kingfisher",
                  subtitle: "Film",
                  href: "/work/kingfisher",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="relative block rounded-3xl overflow-hidden h-64"
                >
                  <video
                    data-src={item.src}
                    className="w-full h-full object-cover mobile-video"
                    data-lazy="true"
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* DESKTOP FEATURED (keeps GSAP pin/scroll) */}
          <div
            className="hidden md:grid grid-cols-1 md:grid-cols-7 h-screen"
            ref={featuredRef}
          >
            <div className="relative overflow-hidden md:col-span-6 h-4/5 mt-40">
              <div className="absolute w-full inset-0">
                <a
                  href="/work/akshat"
                  className="feat-card group absolute inset-0 z-10 rounded-3xl block"
                  style={{ transform: "translateX(0%)" }}
                >
                  <video
                    data-src="/videos/featured/akshat.mp4"
                    className="feat-video absolute inset-0 w-full h-full object-cover rounded-3xl"
                    data-lazy="true"
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                  {/* gradient base so text remains readable */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />

                  {/* top-left pill */}
                  <div className="absolute top-4 left-4 z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      BPFT 2025
                    </div>
                  </div>

                  {/* hover center reveal */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                      <h4 className="text-white text-4xl font-heading uppercase tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]">
                        BPFT 2025
                      </h4>
                      <div className="mt-2 opacity-80 text-sm text-white">
                        Premium Promo Films
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="/work/motion/OakenGlow"
                  className="feat-card group absolute inset-0 z-20 rounded-3xl block"
                  style={{ transform: "translateX(-100%)" }}
                >
                  <video
                    data-src="/videos/featured/oaken.mp4"
                    className="feat-video absolute inset-0 w-full h-full object-cover rounded-3xl"
                    data-lazy="true"
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute top-4 left-4 z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      Oaken Glow
                    </div>
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                      <h4 className="text-white text-4xl font-heading uppercase tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]">
                        Oaken Glow
                      </h4>
                      <div className="mt-2 opacity-80 text-sm text-white">
                        Product Film
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="/work/motion/SuzukiDzire"
                  className="feat-card group absolute inset-0 z-30 rounded-3xl block"
                  style={{ transform: "translateX(-100%)" }}
                >
                  <video
                    data-src="/videos/featured/dzire.mp4"
                    className="feat-video absolute inset-0 w-full h-full object-cover rounded-3xl"
                    data-lazy="true"
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute top-4 left-4 z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      Suzuki Dzire
                    </div>
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                      <h4 className="text-white text-4xl font-heading uppercase tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]">
                        Suzuki Dzire
                      </h4>
                      <div className="mt-2 opacity-80 text-sm text-white">
                        Virtual Production Commercial
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="/work/motion/BallantineStayTrue"
                  className="feat-card group absolute inset-0 z-40 rounded-3xl block"
                  style={{ transform: "translateX(-100%)" }}
                >
                  <video
                    data-src="/videos/featured/ballentines.mp4"
                    className="feat-video absolute inset-0 w-full h-full object-cover rounded-3xl"
                    data-lazy="true"
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute top-4 left-4 z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      Ballantine Stay True
                    </div>
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                      <h4 className="text-white text-4xl font-heading uppercase tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]">
                        Ballantine Stay True
                      </h4>
                      <div className="mt-2 opacity-80 text-sm text-white">
                        Film
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="/work/motion/BallantineStayTrue"
                  className="feat-card group absolute inset-0 z-50 rounded-3xl block"
                  style={{ transform: "translateX(-100%)" }}
                >
                  <video
                    data-src="/videos/featured/kingfisher.mp4"
                    className="feat-video absolute inset-0 w-full h-full object-cover rounded-3xl"
                    data-lazy="true"
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute top-4 left-4 z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      Kingfisher
                    </div>
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                      <h4 className="text-white text-4xl font-heading uppercase tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]">
                        Kingfisher
                      </h4>
                      <div className="mt-2 opacity-80 text-sm text-white">
                        Brand Film
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: vertical text label */}
            <div className="flex items-end justify-center px-8 md:col-span-1 h-4/5 mt-40">
              <h3 className="font-heading font-semibold text-[7rem] sm:text-[8rem] leading-tight text-primary [writing-mode:vertical-rl] [text-orientation:sideways-right] [direction:ltr]">
                FEATURED
              </h3>
            </div>
          </div>
        </section>

        <section id="other-works" className="w-full px-10 py-5 bg-secondary">
          <div className="w-full h-0.5 bg-gradient-to-r from-hanBlue to-secondary my-4" />
          <div className="w-full pb-5">
            <h2
              className="
                        font-heading font-semibold
                        text-[2rem] sm:text-[3rem] lg:text-[4rem]
                        leading-tight
                        text-left
                        text-primary
                        uppercase
                        "
            >
              Other Works
            </h2>
          </div>
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-9 md:grid-rows-2 gap-6">
            <figure className="group relative rounded-xl overflow-hidden md:col-span-6 md:row-span-2">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/04.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              {/* subtle base gradient so text is readable always */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* top-left brand pill */}
              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Vivo
                </div>
              </figcaption>

              <a href="work/motion/VivoLockdown">
                {/* animated center overlay (appears on hover on desktop; always visible on small screens as a bottom strip) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div
                    className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none"
                    aria-hidden
                  >
                    <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Vivo
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Commercial
                    </div>
                  </div>
                </div>
              </a>

              {/* accessibility label for screen readers */}
              <span className="sr-only">Video: Vivo</span>
            </figure>

            <figure className="group relative rounded-xl overflow-hidden md:col-span-3 md:row-span-1">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/06.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Blender Pride
                </div>
              </figcaption>

              <a href="work/motion/VivoLockdown">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Blender Pride
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Commercial
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Blender Pride</span>
            </figure>
            <figure className="group relative rounded-xl overflow-hidden md:col-span-3 md:row-span-1">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/07.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Chivas 18 LEP
                </div>
              </figcaption>
              <a href="work/motion/Chivas18LEP-SuzanneKhan">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Chivas 18 LEP
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Product film
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Chivas 18 LEP</span>
            </figure>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 mt-10 ">
            <figure className="group relative rounded-xl overflow-hidden md:col-span-2 md:row-span-3">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/01.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Society Tea
                </div>
              </figcaption>
              <a href="work/motion/SocietyTea">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-3xl sm:text-4xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Society Tea
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Packaging film
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Society Tea</span>
            </figure>

            <figure className="group relative rounded-xl overflow-hidden md:col-span-2 md:row-span-3">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/03.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Tata Punch
                </div>
              </figcaption>

              <a href="work/motion/TataPunch">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Tata Punch
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Commercial Ad
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Tata Punch</span>
            </figure>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-9 md:grid-rows-2 gap-6 mt-10">
            <figure className="group relative rounded-xl overflow-hidden md:col-span-6 md:row-span-2">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/08.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Suzuki Fronx
                </div>
              </figcaption>

              <a href="work/motion/SuzukiFronx">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-3xl sm:text-4xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Suzuki Fronx
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Commercial
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Suzuki Fronx</span>
            </figure>
            <figure className="group relative rounded-xl overflow-hidden md:col-span-3 md:row-span-1">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/05.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Suzuki Baleno
                </div>
              </figcaption>
              <a href="work/motion/SuzukiBaleno">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-3xl sm:text-4xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Suzuki Baleno
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Commercial
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Suzuki Baleno</span>
            </figure>
            <figure className="group relative rounded-xl overflow-hidden md:col-span-3 md:row-span-1">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                data-src={`/videos/other_work/09.mp4`}
                data-lazy="true"
                loop
                muted
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Oaken Glow
                </div>
              </figcaption>
              <a href="work/motion/SuzukiBaleno">
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                    <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                      Oaken Glow
                    </h4>
                    <div className="mt-2 opacity-80 text-xs text-white">
                      Product Film
                    </div>
                  </div>
                </div>
              </a>

              <span className="sr-only">Video: Oaken Glow</span>
            </figure>
            {/* <figure className="group relative rounded-xl overflow-hidden md:col-span-6 md:row-span-1">
              <video
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                src={`/videos/other_work/02.mp4`}
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <figcaption className="absolute top-4 left-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  Tata Punch
                </div>
              </figcaption>

              <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center pointer-events-none">
                  <h4 className="text-white text-2xl sm:text-3xl font-heading uppercase tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                    Tata Punch
                  </h4>
                  <div className="mt-2 opacity-80 text-xs text-white">
                    Social cut
                  </div>
                </div>
              </div>

              <span className="sr-only">Video: Tata Punch</span>
            </figure> */}
          </div>

          {/* show all row */}
          <div className="grid grid-cols-1 md:grid-rows-3 gap-6 mt-5">
            <div className="relative rounded-xl overflow-hidden md:col-span-1 md:row-span-3 text-right">
              <div className="absolute inset-0 flex items-end justify-end p-4">
                <a
                  href="/allworks/motion"
                  className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded backdrop-blur-sm transition-colors duration-200"
                >
                  SHOW ALL
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export const Head = () => (
  <>
    <title>Epitome</title>
    <link rel="icon" href="/favicon.ico" />
  </>
);

export default MainLanding;
