// src/components/SplashProvider.jsx
import React, { useEffect, useState } from "react";
import Splash from "./splash";

export default function SplashProvider({ children }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Use sessionStorage (per-tab). Switch to localStorage if you want once-ever behavior.
    const KEY = "splashShown_v1";
    const hasShown = sessionStorage.getItem(KEY);

    if (!hasShown) {
      setShowSplash(true);
    }
  }, []);

  function finishSplash() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("splashShown_v1", "1");
    }
    setShowSplash(false);
  }

  return (
    <>
      {children}
      {showSplash && <Splash onFinish={finishSplash} />}
    </>
  );
}
