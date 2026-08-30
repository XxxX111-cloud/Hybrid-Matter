import { useState, useEffect } from 'react';
import { NavLink } from '@lark-apaas/client-toolkit-lite';

const NAV_LINKS = [
  { label: 'About', to: '#about' },
  { label: 'Works', to: '#works' },
  { label: 'Awards', to: '#awards' },
  { label: 'Skills', to: '#skills' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-10 px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Left: Logo group */}
          <div className="flex items-center gap-3">
            <NavLink
              to="#top"
              className="select-none"
            >
              <span
                className="text-black tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                }}
              >
                XxxX
              </span>
            </NavLink>
            <span
              className="text-black select-none"
              style={{
                fontSize: 'clamp(25px, 3vw, 30px)',
                letterSpacing: '-0.02em',
              }}
            >
              &#8203;
            </span>
          </div>

          {/* Center: Desktop nav links, evenly distributed */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center justify-evenly w-[60%] text-gray-600 text-2xl font-semibold">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Desktop CTA */}
          <NavLink
            to="#contact"
            className="hidden md:inline text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
            style={{ fontSize: '23px' }}
          >
            Contact
          </NavLink>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center gap-[5px] p-2"
          >
            <span
              className="block w-6 h-[2px] bg-black transition-transform duration-300"
              style={{
                transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'rotate(0) translateY(0)',
              }}
            />
            <span
              className="block w-6 h-[2px] bg-black transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-[2px] bg-black transition-transform duration-300"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'rotate(0) translateY(0)',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-9 md:hidden flex flex-col justify-center px-8 bg-white/95 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          gap: '2rem',
        }}
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className="text-black font-medium hover:opacity-60 transition-opacity"
            style={{ fontSize: '32px' }}
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="#contact"
          onClick={() => setMenuOpen(false)}
          className="text-black font-medium underline underline-offset-2 hover:opacity-60 transition-opacity"
          style={{ fontSize: '32px' }}
        >
          Contact
        </NavLink>
      </div>
    </>
  );
}
