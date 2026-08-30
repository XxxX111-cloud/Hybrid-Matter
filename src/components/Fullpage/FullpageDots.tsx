import { useFullpage } from './FullpageProvider';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'awards', label: 'Awards' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function FullpageDots() {
  const { currentIndex, goTo, total } = useFullpage();

  return (
    <nav
      aria-label="Page navigation"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3"
    >
      {SECTIONS.slice(0, total).map((s, i) => (
        <button
          key={s.id}
          onClick={() => goTo(i)}
          aria-label={`Go to ${s.label}`}
          className="group relative flex items-center justify-center"
          title={s.label}
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              currentIndex === i
                ? 'w-3 h-3 bg-black scale-100'
                : 'w-2 h-2 bg-black/30 group-hover:bg-black/60'
            }`}
          />
          <span className="pointer-events-none absolute right-5 whitespace-nowrap text-xs font-medium text-black/70 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
