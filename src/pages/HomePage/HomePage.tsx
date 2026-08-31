import { useEffect, useRef } from 'react';
import { FullpageProvider } from '@/components/Fullpage/FullpageProvider';
import FullpageDots from '@/components/Fullpage/FullpageDots';
import BackgroundVideo from '@/components/BackgroundVideo';
import BubbleMenu from '@/components/BubbleMenu/BubbleMenu';
import { WorksDialogProvider, WorksDialogLayer, FullpageLockBridge } from '@/components/WorksDialog/WorksDialogLayer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import WorksSection from './sections/WorksSection';
import AwardsSection from './sections/AwardsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';

const TOTAL_PAGES = 6;
const SECTION_IDS = ['hero', 'about', 'works', 'awards', 'skills', 'contact'];
// 每页的遮罩色 — 与页面底色一致，过渡更自然
// Hero 透明背景(视频) → 用白；About 白；Works 白；Awards 黑；Skills 白；Contact 白
const PAGE_MASK_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#000000', '#ffffff', '#ffffff'];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 防止 body 出现滚动条（FullpageProvider 内部 fixed 铺满）
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const renderPage = (index: number) => {
    switch (index) {
      case 0:
        return <HeroSection />;
      case 1:
        return <AboutSection />;
      case 2:
        return <WorksSection />;
      case 3:
        return <AwardsSection />;
      case 4:
        return <SkillsSection />;
      case 5:
        return <ContactSection />;
      default:
        return null;
    }
  };

  return (
    <WorksDialogProvider>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-foreground">
        <FullpageProvider
          total={TOTAL_PAGES}
          background={<BackgroundVideo />}
          pageMaskColors={PAGE_MASK_COLORS}
          chrome={
            <>
              <FullpageLockBridge />
              {/* 导航浮层（pointer-events-none 由父容器统一设置，子组件需自行开启） */}
              <div className="pointer-events-auto">
                <BubbleMenu
                  logo="./logo-xh.png"
                  useFixedPosition={true}
                  menuBg="#ffffff"
                  menuContentColor="#111111"
                  sectionIds={SECTION_IDS}
                />
              </div>
              <div className="pointer-events-auto">
                <FullpageDots />
              </div>
            </>
          }
        >
          {(index) => (
            <div
              className="w-full h-full overflow-hidden"
              key={SECTION_IDS[index]}
            >
              {renderPage(index)}
            </div>
          )}
        </FullpageProvider>

        {/* 弹窗层：放在 FullpageProvider 之外，不受翻页动画影响 */}
        <WorksDialogLayer />
      </div>
    </WorksDialogProvider>
  );
}
