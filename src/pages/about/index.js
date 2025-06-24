import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../../components/footer";

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: "/images/text-logo.png", alt: "Image 1", rotate: "-rotate-3" },
  { src: "/images/logomark_w.svg", alt: "Image 2", rotate: "rotate-2" },
  { src: "/images/logo_type_w.png", alt: "Image 3", rotate: "-rotate-2" },
  { src: "/images/icon-logo.png", alt: "Image 4", rotate: "rotate-1" },
];
const allImages = [...images, ...images, ...images, ...images, ...images];
export default function AboutPage() {
  const bgVidRef = useRef(null);
  const overlayRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryInnerRef = useRef(null);
  const featuredRef = useRef(null);
  const videosInnerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const splashRef = useRef(null);

  const containerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const width = el.scrollWidth / 2; // half the total, since we duplicated

    // Create a continuous horizontal loop tween
    // tlRef.current = gsap.to(el, {
    //   x: -width,
    //   ease: "none",
    //   duration: 30,
    //   repeat: -1,
    // });
    tlRef.current = gsap.to(el, {
      xPercent: -50,
      ease: "none",
      duration: 30,
      repeat: -1,
    });

    // Slow down on hover
    const handleEnter = () => tlRef.current.timeScale(0.3);
    const handleLeave = () => tlRef.current.timeScale(1);

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      tlRef.current.kill();
    };
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
    gsap.to(overlayRef.current, {
      yPercent: -100,
      ease: "power2.out",
      scrollTrigger: {
        trigger: overlayRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,

        onUpdate: (self) => {
          const raw = self.progress; // 0 → 1
          const fadeStart = 0.95; // start fading at 80%
          const fadeRange = 1 - fadeStart; // last 20% of scroll
          let opacity = (raw - fadeStart) / fadeRange;
          opacity = Math.min(Math.max(opacity, 0), 1); // clamp 0→1

          bgVidRef.current.style.opacity = opacity;
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
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
  return (
    <main className="relative overflow-x-hidden">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden  bg-[#111111] transition-colors duration-300">
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
      <section className="w-full h-[50vh] relative bg-[#111111]">
        <div className="absolute w-full text-5xl md:text-7xl text-left font-['Helvetica'] font-normal bottom-0 left-1/2 px-8 transform -translate-x-1/2 text-white pb-10">
          WE CREATE CONTENT THAT CAPTIVATES AND CONNECTS.
        </div>
      </section>
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
      <div className="h-screen z-0 relative" />
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/videos/v3.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        ref={overlayRef}
        className="fixed inset-10 z-10 flex justify-center items-center"
      >
        {/* Centered logo */}
      </div>
      <div className="h-auto pt-20 bg-[#111111]">
        <section className="w-full bg-[#111111] grid grid-cols-2 gap-32 text-white py-10 px-8">
          <div>
            <h2 className="text-3xl uppercase font-heading font-normal">
              We collaborate with brands, businesses & agencies to create
              stellar content.
            </h2>
          </div>
          <div>
            <p>
              At Epitome, our approach begins with collaboration.
              <br />
              <br />
              We believe that the most successful projects are the ones that
              involve fluid communication, trust and an open door to creativity.
              <br />
              <br />
              From there, it's about staying fluid in our execution. Whether
              it's a commercial film for a brand, a spotlight film on a company
              or a series of social media spots - no two projects are ever
              exactly alike.
              <br />
              <br />
              So we stay flexible and adapt to each project's needs from our
              first conversation through final delivery.
            </p>
          </div>
        </section>
        <div className="relative py-1">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-lightNeutral to-transparent" />
        </div>
        <section className="w-full py-10 grid grid-row-2 gap-2 md:gap-10 text-white px-8">
          <div className=" text-4xl flex justify-center items-center font-heading">
            OUR CAPABILITIES
          </div>
          <div className="grid md:grid-cols-3 gap-6 justify-center items-center text-center">
            <div>
              <div className="font-heading text-2xl pb-5">Delivery</div>
              <div className=" text-xs">
                {("Film Editing",
                [
                  "Photo Editing",
                  "Motion Graphics",
                  "Sound Design",
                  "Visual FX ",
                  "Music Licensing",
                  "Color Grading",
                  "Distribution Strategy",
                  "Media Buying",
                ]).map((e, i) => (
                  <div className="pb-1">
                    {e} <br />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl pb-5">Creative</div>
              <div className=" text-xs">
                {("Film Editing",
                [
                  "Concept Ideation",
                  "Pre-Production",
                  "Storyboarding",
                  "Script Writing",
                  "Casting",
                  "Location Sourcing",
                  "Production Planning",
                  "Line Producing",
                  "Strategy",
                ]).map((e, i) => (
                  <div className="pb-1">
                    {e} <br />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl pb-5">Production</div>
              <div className=" text-xs">
                {("Film Editing",
                [
                  "Directing",
                  "Cinematography",
                  "Photography",
                  "Art Direction",
                  "Set Design",
                  "Wardrobe Styling",
                  "Audio Production",
                  "Logistics and Management",
                  "Procurement of Vendors",
                ]).map((e, i) => (
                  <div className="pb-1">
                    {e} <br />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* <div className="relative py-1">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-lightNeutral to-transparent" />
        </div> */}
        <section className="w-full py-10 pb-32">
          <div className="relative overflow-hidden ">
            <div
              ref={containerRef}
              className="flex whitespace-nowrap will-change-transform"
            >
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className={`h-10 w-auto flex-shrink-0 rounded-lg mx-4 transition-transform duration-300`}
                />
              ))}
            </div>
          </div>
        </section>
        {/* <div className="relative py-1">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-lightNeutral to-transparent" />
        </div> */}
      </div>
      <Footer />
    </main>
  );
}
