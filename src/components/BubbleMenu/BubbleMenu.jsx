import { useState, useEffect, useContext } from 'react';
import './BubbleMenu.css';
import { UniversalLink } from '@lark-apaas/client-toolkit-lite';
import { Image } from '@/components/ui/image';
import OptionWheel from '@/components/OptionWheel/OptionWheel';
import { FullpageContext } from '@/components/Fullpage/FullpageProvider';

const DEFAULT_SECTION_IDS = ['hero', 'about', 'works', 'awards', 'skills', 'contact'];

const LABEL_MAP = {
  hero: 'Home',
  about: 'About',
  works: 'Works',
  awards: 'Awards',
  skills: 'Skills',
  contact: 'Contact',
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = false,
  sectionIds = DEFAULT_SECTION_IDS,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fullpageCtx = useContext(FullpageContext);

  const currentIndex = fullpageCtx?.currentIndex ?? 0;
  const goTo = fullpageCtx?.goTo ?? (() => {});
  const registerLock = fullpageCtx?.registerLock ?? (() => {});

  const wheelItems = sectionIds.map((id) => LABEL_MAP[id] || id);

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    onMenuClick?.(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // 菜单打开时锁定翻页 + 锁定 body 滚动
  useEffect(() => {
    if (isOpen) {
      registerLock('bubble-menu', true);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      registerLock('bubble-menu', false);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      registerLock('bubble-menu', false);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, registerLock]);

  // 翻到指定页
  const goToPage = (index) => {
    const clamped = Math.max(0, Math.min(sectionIds.length - 1, index));
    goTo(clamped);
  };

  // OptionWheel 选中 → 翻到对应页
  const handleWheelSelect = (_idx, label) => {
    const targetId = sectionIds.find((id) => LABEL_MAP[id] === label);
    if (!targetId) return;
    setIsOpen(false);
    const targetIdx = sectionIds.indexOf(targetId);
    // 等菜单收起动画（~300ms）再翻页，视觉更顺
    setTimeout(() => {
      goToPage(targetIdx);
    }, 300);
  };

  return (
    <>
      <nav
        className={containerClassName}
        style={style}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="bubble logo-bubble pointer-events-auto"
          aria-label="Logo - Back to home"
          style={{ background: menuBg, cursor: 'pointer' }}
          onClick={() => goToPage(0)}
        >
          <span className="logo-content">
            {typeof logo === 'string' ? (
              <Image src={logo} alt="Logo" className="bubble-logo" />
            ) : (
              logo
            )}
          </span>
        </button>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn pointer-events-auto ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={menuAriaLabel}
          aria-expanded={isOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>

      {/* 菜单遮罩层 —— 始终在 DOM 中，用 CSS 控制显隐 */}
      <div
        className={`bubble-menu-overlay pointer-events-auto ${useFixedPosition ? 'fixed' : 'absolute'} ${isOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      >
        <div
          className="bubble-menu-wheel-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <OptionWheel
            items={wheelItems}
            defaultSelected={0}
            selectedIndex={currentIndex}
            onChange={handleWheelSelect}
            textColor="#9ca3af"
            activeColor="#000000"
            side="right"
            fontSize={2.0}
            spacing={1.75}
            curve={0.3}
            tilt={2.5}
            blur={0}
            fade={0}
            minOpacity={1}
            smoothing={220}
            inset={120}
          />
        </div>
      </div>
    </>
  );
}
