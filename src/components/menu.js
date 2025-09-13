import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function NavMenu({ menuOpen, setMenuOpen }) {
  const MENU = [
    { name: "HOME", link: "/" },
    {
      name: "WORK",
      link: "/allworks",
      submenu: [
        { name: "TVC", link: "/allworks/motion" },
        { name: "Short Films", link: "/allworks/films" },
        { name: "Digital", link: "/allworks/digital" },
        { name: "Stills", link: "/allworks/stills" },
      ],
    },
    { name: "ABOUT", link: "/about" },
  ];

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        ".menu-item",
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "back.out(0.5)",
          duration: 1.3,
          stagger: 0.05,
        }
      );

      gsap.fromTo(
        ".submenu-item",
        { y: -12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 1.3,
          stagger: 0.05,
          delay: 0.2,
        }
      );
    } else {
      gsap.to(".menu-item", { opacity: 0, y: -50, duration: 1.3 });
      gsap.to(".submenu-item", { opacity: 0, y: -12, duration: 1.3 });
    }
  }, [menuOpen]);

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-30 backdrop-blur-xl bg-black/70 flex items-center justify-start">
          <ul className="menu-items text-white text-5xl md:text-7xl sm:text-5xl font-heading tracking-tighter pl-8 space-y-8 w-full max-w-[720px]">
            {MENU.map((item) => {
              const hasSub = Array.isArray(item.submenu);

              return (
                <li key={item.name} className="menu-item opacity-0 group">
                  <div className="flex items-center justify-start gap-6">
                    {/* main link */}
                    <a
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="transition-all duration-300 transform hover:opacity-30 md:hover:text-[5.2rem]"
                    >
                      {item.name}
                    </a>

                    {/* arrow (purely decorative now) */}
                    {hasSub && (
                      <span className="ml-4 p-1 rounded-md transform transition-transform duration-300 group-hover:rotate-180">
                        ▾
                      </span>
                    )}
                  </div>

                  {/* SUBMENU - always visible */}
                  {hasSub && (
                    <ul
                      id={`${item.name}-submenu`}
                      className="pl-10 mt-4 opacity-100 max-h-none"
                    >
                      {item.submenu.map((sub) => (
                        <li
                          key={sub.name}
                          className="submenu-item mb-3 text-3xl"
                        >
                          <a
                            href={sub.link}
                            onClick={() => setMenuOpen(false)}
                            className="block transition-all duration-300 transform hover:opacity-40 font-heading tracking-tighter uppercase hover:text-4xl"
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
