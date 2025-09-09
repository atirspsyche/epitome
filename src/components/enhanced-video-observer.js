import { useEffect, useRef } from "react";

function useEnhancedVideoObserver() {
  const observerRef = useRef(null);
  const loadedVideosRef = useRef(new Set());
  const maxConcurrentVideos = useRef(6); // Increased limit for better UX

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const videos = document.querySelectorAll("video[data-lazy]");
    if (!videos.length) return;

    // Priority-based video loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            loadVideo(video);
          } else {
            unloadVideo(video);
          }
        });
      },
      {
        threshold: 0.05, // Reduced threshold for earlier loading
        rootMargin: "200px", // Increased margin for preloading
      }
    );

    const loadVideo = (video) => {
      if (loadedVideosRef.current.has(video)) return;

      // Only limit if we're way over the limit
      if (loadedVideosRef.current.size >= maxConcurrentVideos.current * 2) {
        video.dataset.queued = "true";
        return;
      }

      video.classList.add("playing");
      loadedVideosRef.current.add(video);

      // Lazy load the video source
      if (video.dataset.src && !video.src) {
        video.src = video.dataset.src;
        video.load();
      }

      if (video.paused) {
        video.play().catch((err) => {
          console.log("Video play failed:", err);
        });
      }
    };

    const unloadVideo = (video) => {
      if (!loadedVideosRef.current.has(video)) return;

      video.classList.remove("playing");
      loadedVideosRef.current.delete(video);

      if (!video.paused) {
        video.pause();
      }

      // Check if any videos are queued
      const queuedVideo = document.querySelector('video[data-queued="true"]');
      if (queuedVideo) {
        queuedVideo.removeAttribute("data-queued");
        loadVideo(queuedVideo);
      }
    };

    videos.forEach((v) => observer.observe(v));
    observerRef.current = observer;

    // Cleanup on component unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      loadedVideosRef.current.clear();
    };
  }, []);

  return { loadedVideosCount: loadedVideosRef.current?.size || 0 };
}

export default useEnhancedVideoObserver;
