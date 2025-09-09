import React, { useEffect, useState } from "react";

function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    videoCount: 0,
    scrollTriggerCount: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMetrics = () => {
      const videos = document.querySelectorAll("video");
      const playingVideos = document.querySelectorAll("video.playing");
      const scrollTriggers = window.ScrollTrigger?.getAll?.() || [];

      let memoryUsage = 0;
      if (performance.memory) {
        memoryUsage = Math.round(
          performance.memory.usedJSHeapSize / 1024 / 1024
        );
      }

      setMetrics({
        totalVideos: videos.length,
        playingVideos: playingVideos.length,
        scrollTriggerCount: scrollTriggers.length,
        memoryUsage,
      });
    };

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

function PerformanceMonitor({ showMonitor = false }) {
  const metrics = usePerformanceMonitor();

  if (!showMonitor || process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      <div>
        Videos: {metrics.playingVideos}/{metrics.totalVideos}
      </div>
      <div>ScrollTriggers: {metrics.scrollTriggerCount}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
    </div>
  );
}

export default PerformanceMonitor;
