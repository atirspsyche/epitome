// src/components/Splash.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Splash({ onFinish }) {
  const splashRef = useRef(null);
  const videoRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    // play video (best-effort). Browsers may block autoplay on some configs;
    // your video has muted + playsInline which helps.
    if (videoRef.current && typeof videoRef.current.play === "function") {
      try {
        videoRef.current.play().catch(() => {});
      } catch (e) {}
    }

    // lock scroll while splash is visible
    const prevOverflow =
      typeof document !== "undefined" ? document.body.style.overflow : "";
    if (typeof document !== "undefined")
      document.body.style.overflow = "hidden";

    // timeline: wait 3s, then slide splash up, then call onFinish
    tlRef.current = gsap.to(splashRef.current, {
      yPercent: -100,
      ease: "power2.inOut",
      duration: 1,
      delay: 3,
      onComplete: () => {
        if (typeof document !== "undefined")
          document.body.style.overflow = prevOverflow;
        if (onFinish) onFinish();
      },
    });

    return () => {
      // cleanup
      if (tlRef.current) tlRef.current.kill();
      if (typeof document !== "undefined")
        document.body.style.overflow = prevOverflow;
    };
  }, [onFinish]);

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src="/videos/epi.mp4"
        className="w-1/3"
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster="/images/epi1.png"
      />
    </div>
  );
}
