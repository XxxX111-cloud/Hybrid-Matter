import { Award, Eye } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit-lite';
import { MOCK_AWARDS, type IAward } from '@/data/portfolio';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';
import Ferrofluid from '@/components/Ferrofluid/Ferrofluid';
import { useFullpage } from '@/components/Fullpage/FullpageProvider';

export default function AwardsSection() {
  const { forceGoTo, currentIndex, total } = useFullpage();

  /**
   * 点击「查看作品」跳转到 Works 页面（索引 2）
   *
   * 翻页实现说明：
   * - 全站使用自定义 FullpageProvider（非 fullpage.js），通过 React state + clip-path 遮罩实现转场
   * - 页面索引：0=Hero, 1=About, 2=Works, 3=Awards, 4=Skills, 5=Contact
   * - 使用 forceGoTo 而非 goTo：跳过 isAnimating / isLocked 检查，确保按钮点击一定有响应
   *   （普通 goTo 在动画收尾或被意外锁定时会静默 return，用户感觉"点了没反应"）
   */
  const handleViewWorks = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止事件冒泡到任何父级监听，避免干扰
    e.stopPropagation();
    logger.info('[Awards] 查看作品按钮点击', { currentIndex, total, target: 2 });
    forceGoTo(2);
  };

  return (
    <section id="awards" className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 铁磁流体背景层 */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid
          colors={['#ffffff', '#ffffff', '#ffffff']}
          speed={0.4}
          scale={2.2}
          turbulence={0.6}
          fluidity={0.45}
          rimWidth={0.5}
          sharpness={2.5}
          shimmer={1.2}
          glow={2.0}
          flowDirection="up"
          opacity={0.85}
          mouseInteraction={false}
          mouseStrength={0.4}
          mouseRadius={0.18}
          mouseDampening={0.2}
        />
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-16 md:py-20">
          <StaggerItem delay={0.05} offsetMultiplier={0.8}>
            <span className="text-[13px] uppercase tracking-[0.2em] text-white/50">
              03 — Awards
            </span>
          </StaggerItem>
          <div className="mt-4">
            <SplitTextTitle
              as="h2"
              staggerMs={35}
              offsetPx={40}
              enterScale={1.06}
              className="text-white font-normal"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 6vw, 64px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Recognized work.
            </SplitTextTitle>
          </div>

          <div className="space-y-4 md:space-y-5 pb-8 mt-8">
            {MOCK_AWARDS.map((award: IAward, idx: number) => (
              <StaggerItem
                key={award.id}
                delay={0.2 + idx * 0.08}
                offsetMultiplier={0.8}
                enterScale={1.01}
              >
                <div className="group relative border rounded-2xl p-6 md:p-8 bg-white/[0.02] backdrop-blur-sm border-white/15 transition-all">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="shrink-0 size-10 md:size-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Award className="size-5 md:size-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                        <h3
                          className="text-white font-medium"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(18px, 2.5vw, 24px)',
                          }}
                        >
                          {award.title}
                        </h3>
                        <span className="text-white/50 text-sm shrink-0">
                          {award.year}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm md:text-base leading-relaxed">
                        {award.detail}
                      </p>
                      <button
                        type="button"
                        onClick={handleViewWorks}
                        className="relative z-20 mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/90 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer select-none"
                      >
                        <Eye className="size-4" />
                        查看作品
                      </button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
