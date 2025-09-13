import "./src/styles/global.css";

import React from "react";
import Layout from "./src/components/layout";

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};

// Add loading screen during initial page load
export const onClientEntry = () => {
  // Show loading screen immediately
  if (typeof window !== "undefined") {
    // Prevent scrolling during load
    document.body.style.overflow = "hidden";

    // Add loading screen HTML
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "gatsby-loading-screen";
    loadingScreen.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        flex-direction: column;
      ">
        <img 
          src="/images/logomark_w.svg" 
          alt="Loading" 
          style="width: 120px; height: 120px; margin-bottom: 2rem; animation: pulse 2s infinite;"
        />
        <div style="
          width: 240px;
          height: 4px;
          background: #333;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 1rem;
        ">
          <div style="
            height: 100%;
            background: #fff;
            border-radius: 2px;
            animation: loading 3s ease-in-out infinite;
          "></div>
        </div>

      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      </style>
    `;
    document.body.appendChild(loadingScreen);
  }
};

// Remove loading screen when initial render is complete
export const onInitialClientRender = () => {
  if (typeof window !== "undefined") {
    const loadingScreen = document.getElementById("gatsby-loading-screen");
    if (loadingScreen) {
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        loadingScreen.style.transition = "opacity 0.8s ease-out";
        loadingScreen.style.opacity = "0";

        setTimeout(() => {
          loadingScreen.remove();
          document.body.style.overflow = "";
        }, 800);
      }, 500);
    }
  }
};
