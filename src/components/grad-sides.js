import React from "react";
export default function SideGradients() {
  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 h-full w-[5vw] md:w-[5vw] z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,94,137,0.12), rgba(70,120,255,0.08))",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed right-0 top-0 h-full w-[5vw] md:w-[5vw] z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,94,137,0.12), rgba(70,120,255,0.08))",
        }}
        aria-hidden="true"
      />
    </>
  );
}
