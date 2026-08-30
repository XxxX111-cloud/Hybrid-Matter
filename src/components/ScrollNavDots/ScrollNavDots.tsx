import { useEffect, useState } from 'react';

interface ScrollNavDotsProps {
  sectionIds: string[];
}

/**
 * 右侧导航点（基于滚动位置高亮，点击平滑滚动到对应 section）
 */
export default function ScrollNavDots({ sectionIds }: ScrollNavDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateActive = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          idx = i;
        }
      }
      setActiveIndex(idx);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const labels: Record<string, string> = {
    hero: 'Home',
    about: 'About',
    works: 'Works',
    awards: 'Awards',
    skills: 'Skills',
    contact: 'Contact',
  };

  return (
    <nav
      aria-label="页面导航"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3"
    >
      {sectionIds.map((id, i) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          aria-label={`跳转到 ${labels[id] || id}`}
          className="group relative flex items-center justify-center"
          title={labels[id] || id}
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              activeIndex === i
                ? 'w-3 h-3 bg-black scale-100'
                : 'w-2 h-2 bg-black/30 group-hover:bg-black/60'
            }`}
          />
          <span className="pointer-events-none absolute right-5 whitespace-nowrap text-xs font-medium text-black/70 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {labels[id] || id}
          </span>
        </button>
      ))}
    </nav>
  );
}
