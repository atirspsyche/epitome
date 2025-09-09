// src/components/Layout.jsx
import React from "react";
import SideBars from "./side-bars";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* global thin bars on top of everything (non-blocking) */}
      <SideBars showOnMobile={false} />

      {/* rest of your site content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
