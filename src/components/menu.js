import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function NavMenu({ menuOpen, setMenuOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState(null); // for mobile/tap toggle
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const MENU = [
    { name: "HOME", link: "/" },
    { name: "RECENT", link: "/" },
    {
      name: "WORK",
      link: "/allworks",
      submenu: [
        { name: "Motion", link: "/allworks/motion" },
        { name: "Short Films", link: "/allworks/films" },
        { name: "Digital", link: "/allworks/motion" },
        { name: "Stills", link: "/allworks/stills" },
      ],
    },
    { name: "ABOUT", link: "/about" },
  ];

  useEffect(() => {
    if (menuOpen) {
      // animate top-level items in
      gsap.fromTo(
        ".menu-item",
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "back.out(1.7)",
          duration: 0.5,
          stagger: 0.12,
        }
      );

      // animate submenu items a little later (if present)
      gsap.fromTo(
        ".submenu-item",
        { y: -12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.35,
          stagger: 0.08,
          delay: 0.25,
        }
      );
    } else {
      gsap.to(".menu-item", { opacity: 0, y: -50, duration: 0.18 });
      gsap.to(".submenu-item", { opacity: 0, y: -12, duration: 0.12 });
      setOpenSubmenu(null);
    }
  }, [menuOpen]);

  // toggle submenu by name (for mobile)
  function toggleSubmenu(name) {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  }

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/90 flex items-center justify-start">
          <ul className="menu-items text-white text-5xl md:text-7xl sm:text-5xl font-heading pl-8 space-y-8 w-full max-w-[720px]">
            {MENU.map((item) => {
              const hasSub = Array.isArray(item.submenu);
              const isOpen = openSubmenu === item.name;

              return (
                <li key={item.name} className="menu-item opacity-0 group">
                  <div className="flex items-center justify-start gap-6">
                    {/* main link */}
                    <a
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="transition-all duration-300 transform hover:opacity-30 md:hover:text-8xl "
                    >
                      {item.name}
                    </a>

                    {/* arrow / toggle only if submenu exists and not on mobile */}
                    {hasSub && !isMobile && (
                      // button so clicks don't navigate away
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu(item.name);
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`${item.name}-submenu`}
                        className="ml-4 p-1 rounded-md transform transition-transform duration-300 group-hover:rotate-180"
                      >
                        {/* rotate arrow when open */}
                        <span
                          className={`inline-block transition-transform duration-300 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                    )}
                  </div>

                  {/* SUBMENU - in normal flow so it pushes the next item down */}
                  {hasSub && (
                    <ul
                      id={`${item.name}-submenu`}
                      // Keep this in-flow (not absolute). Use max-h trick to animate height.
                      className={`pl-10 mt-4 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                        // On mobile: always show submenus, on desktop: show on hover OR when toggled open
                        isMobile
                          ? "max-h-[300px] opacity-100"
                          : `max-h-0 opacity-0 group-hover:max-h-[300px] group-hover:opacity-100 ${
                              isOpen ? "max-h-[300px] opacity-100" : ""
                            }`
                      }`}
                    >
                      {item.submenu.map((sub) => (
                        <li
                          key={sub.name}
                          className="submenu-item mb-3 text-3xl"
                        >
                          <a
                            href={sub.link}
                            onClick={() => setMenuOpen(false)}
                            className="block transition-all duration-300 transform hover:opacity-40 font-heading uppercase hover:text-4xl "
                          >
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
