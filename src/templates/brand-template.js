import React, { useRef, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ReactPlayer from "react-player";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import data from "../../../data/motion-data.json";
import Footer from "../components/footer";
import WhiteFooter from "../components/white_footer";
import NavMenu from "../components/menu";

gsap.registerPlugin(ScrollTrigger);

// Custom hook for responsive video scaling
const useVideoScale = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const windowRatio = window.innerWidth / window.innerHeight;
      const videoRatio = 16 / 9; // Assuming 16:9 aspect ratio, adjust as needed

      if (windowRatio < videoRatio) {
        // Window is taller than video ratio, scale based on height
        setScale(window.innerHeight / (window.innerWidth / videoRatio));
      } else {
        // Window is wider than video ratio, scale based on width
        setScale(window.innerWidth / (window.innerHeight * videoRatio));
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return scale;
};

export default function BrandPage({ pageContext }) {
  const brand = pageContext?.brand;
  //   const brand =
  //     brand &&
  //     data.find((e) => String(e.brand_name).replace(/\s+/g, "") == brand);

  const [menuOpen, setMenuOpen] = useState(false);
  const bgVidRef = useRef();
  const videoScale = useVideoScale();

  // Video optimization - only play videos when visible
  useEffect(() => {
    const videos = document.querySelectorAll("video[data-lazy]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.classList.add("playing");
            if (video.paused) {
              video.play().catch(console.log);
            }
          } else {
            video.classList.remove("playing");
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
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
    <main className="relative overflow-x-hidden cursor-none">
      <div
        id="custom-cursor"
        className="z-50 pointer-events-none fixed top-0 left-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <header className="fixed inset-x-0 top-0 z-40 h-20 overflow-hidden transition-colors duration-300 bg-gradient-to-r from-secondary via-transparent to-secondary">
        {/* Background video inside header (fills the 80px / h-20 height) */}
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

        {/* Overlay on top of video for slight darkening (optional) */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}

        {/* Header content (logo text + burger) */}
        <div className="relative flex z-10 items-center justify-between h-full px-8">
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
              className={`absolute inset-0 w-full h-full text-primary transition-opacity duration-500 ease-in-out ${
                menuOpen
                  ? "opacity-0 scale-75 rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />

            {/* Close */}
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

      <div className="fixed inset-0 object-cover z-0 pointer-events-auto overflow-hidden bg-black">
        <ReactPlayer
          src={brand.main_video_url}
          playing={true}
          muted={true}
          loop={true}
          width="100%"
          height="100%"
          config={{
            vimeo: {
              playerOptions: {
                background: true,
                controls: false,
                title: false,
                byline: false,
                portrait: false,
                autoplay: true,
                autopause: false,
                muted: true,
                responsive: true,
              },
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            transform: "translate(-50%, -50%)",
            minWidth: "100%",
            minHeight: "100%",
          }}
          className="react-player-crop"
          controls={false}
        />
        {/* <iframe
          style={{
            top: 0,
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
          title="vimeo-player"
          src="https://player.vimeo.com/video/658915066?h=da7128b2c8"
          className="object-none w-screen h-screen"
          // width="640"
          // height="360"
          allow="fullscreen"
          frameborder="0"
          allowfullscreen
        ></iframe> */}

        {/* <div>
          <iframe
            src={`https://player.vimeo.com/video/720110367?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            }}
            title="REDMI 10A FILM03 30 200522 WITHOUT SUBTITLE.MP4"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script> */}
      </div>

      <div className="h-[90vh] z-10 relative text-primary px-8 py-8">
        <div className="flex flex-col justify-end font-heading gap-5 w-full h-full">
          <div className="uppercase font-heading text-5xl md:text-8xl leading-tight text-left text-primary">
            {brand.brand_name}
          </div>
          <div className="text-2xl md:text-4xl font-semibold text-primary">
            {brand.subtitle}
          </div>
          <div className="font-semibold text-primary">
            {brand.pagination_text}
          </div>
        </div>
      </div>
      <div className="h-[10vh] -z-10 relative"></div>

      <div className="relative grid md:grid-cols-2 bg-primary z-10 px-8 py-16 gap-10">
        <div>
          <div className="font-heading text-3xl uppercase bg-clip-text leading-tight text-hanBlue">
            About Project
          </div>
          <div className="py-4 md:w-3/4 text-sm text-body text-secondary">
            {brand.about}
          </div>
        </div>
        <div>
          <div className="font-heading text-3xl uppercase font-semibold bg-clip-text leading-tight text-hanBlue">
            Credits
          </div>
          <div className="py-4">
            {brand.credits.map((el, i) => (
              <div>
                <div className="pb-2 text-sm text-body text-secondary">
                  <b>{el.title} </b>: {el.description}
                </div>
              </div>
              // <div className="grid grid-cols-2">
              // </div>
            ))}
          </div>
          {/* <div className="py-4 md:w-3/4 text-sm">{brand.about}</div> */}
        </div>
      </div>

      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2 object-cover">
          {[brand.grids_media[0]].map((b, ind) =>
            b.type == "image" ? (
              <img
                src={`/images/${b.url}`}
                className="inset-0 w-full h-full object-cover"
              />
            ) : (
              <video
                src={`/videos/${b.url}`}
                className="inset-0 w-full h-full object-cover"
                data-lazy="true"
                muted
                loop
                playsInline
                preload="metadata"
              />
            )
          )}
        </div>
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10 p-10">
        {[brand.grids_media[1], brand.grids_media[2]].map((b, ind) =>
          b.type == "image" ? (
            <div>
              <img src={`/images/${b.url}`} />
            </div>
          ) : (
            <div>
              <video
                src={`/videos/${b.url}`}
                data-lazy="true"
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          )
        )}
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2">
          {[brand.grids_media[3]].map((b, ind) =>
            b.type == "image" ? (
              <img
                src={`/images/${b.url}`}
                className="inset-0 w-full h-full object-cover"
              />
            ) : (
              <video
                src={`/videos/${b.url}`}
                className="inset-0 w-full h-full object-cover"
                data-lazy="true"
                muted
                loop
                playsInline
                preload="metadata"
              />
            )
          )}
        </div>
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10 p-10">
        {[brand.grids_media[4], brand.grids_media[5]].map((b, ind) =>
          b.type == "image" ? (
            <div>
              <img src={`/images/${b.url}`} />
            </div>
          ) : (
            <div>
              <video
                src={`/videos/${b.url}`}
                data-lazy="true"
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          )
        )}
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2">
          {[brand.grids_media[6]].map((b, ind) =>
            b.type == "image" ? (
              <img
                src={`/images/${b.url}`}
                className="inset-0 w-full h-full object-cover"
              />
            ) : (
              <video
                src={`/videos/${b.url}`}
                className="inset-0 w-full h-full object-cover"
                data-lazy="true"
                muted
                loop
                playsInline
                preload="metadata"
              />
            )
          )}
        </div>
      </div>
      <div className="relative">
        {/* <WhiteFooter /> */}
        <Footer />
      </div>
    </main>
  );
}
