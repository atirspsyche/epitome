import React from "react";

/**
 * Simple fixed thin bars (5px) on left + right of viewport.
 * - Uses Tailwind classes only (w-[5px], bg-gradient-to-b from-sky-500 to-orange-500)
 * - pointer-events-none so clicks go through
 * - hidden on xs by default (remove hidden sm:block to show on mobile)
 */
export default function SideBars({ showOnMobile = false }) {
  const visibility = showOnMobile ? "block" : "hidden sm:block";

  return (
    <>
      {/* left bar */}
      <div
        aria-hidden
        className={`${visibility} fixed inset-y-0 left-0 w-[5px] z-50 pointer-events-none bg-gradient-to-b from-coralRed to-hanBlue`}
      />

      {/* right bar */}
      <div
        aria-hidden
        className={`${visibility} fixed inset-y-0 right-0 w-[5px] z-50 pointer-events-none bg-gradient-to-b from-coralRed to-hanBlue`}
      />
    </>
  );
}
