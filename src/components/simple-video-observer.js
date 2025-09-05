import { useEffect } from "react";

function useSimpleVideoObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const videos = document.querySelectorAll("video[data-lazy]");
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            // Load video source if not already loaded
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src;
              video.load();
            }

            video.classList.add("playing");

            if (video.paused) {
              video.play().catch((err) => {
                console.log("Video play failed:", err);
              });
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

    videos.forEach((v) => observer.observe(v));

    return () => {
      observer.disconnect();
    };
  }, []);
}

export default useSimpleVideoObserver;
