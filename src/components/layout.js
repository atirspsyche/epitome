// src/components/Layout.jsx
import React from "react";
import SideBars from "./side-bars";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative">
      <SideBars showOnMobile={false} />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
