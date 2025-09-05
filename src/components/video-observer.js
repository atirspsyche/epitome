import { useEffect } from "react";

function useVideoObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const videos = document.querySelectorAll("video[data-lazy]");
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.classList.add("playing");
            if (video.paused) {
              // browsers often require muted for autoplay — ensure your markup sets muted when needed
              video.play().catch((err) => {
                // optional: handle/capture autoplay errors
                console.log("Video play failed:", err);
              });
            }
          } else {
            video.classList.remove("playing");
            if (!video.paused) video.pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    videos.forEach((v) => observer.observe(v));

    return () => {
      observer.disconnect(); // cleaner than unobserving each node
    };
  }, []);
}

export default useVideoObserver;
