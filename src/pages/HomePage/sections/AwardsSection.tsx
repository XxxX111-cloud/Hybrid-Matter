import { Award, ArrowUpRight } from 'lucide-react';
import { MOCK_AWARDS, type IAward } from '@/data/portfolio';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';
import Ferrofluid from '@/components/Ferrofluid/Ferrofluid';
import { useWorksDialog } from '@/components/WorksDialog/WorksDialogContext';
import { useFullpage } from '@/components/Fullpage/FullpageProvider';

export default function AwardsSection() {
  const { openDialog } = useWorksDialog();
  const { registerLock } = useFullpage();

  // 奖项 → 对应作品弹窗 id 的映射（只有在 Works 中有弹窗的奖项才链接）
  const AWARD_TO_WORK: Record<string, 'prepped-food-spring' | 'dt-business-video' | 'throat-civilization' | 'yi-tao'> = {
    'mapping-finalist': 'prepped-food-spring', // 预制菜也有春天
    'huichuang-youth': 'throat-civilization', // 喉间文明
    'future-designer': 'yi-tao', // 意陶
    'future-designer-14th': 'yi-tao', // 意陶 第14届一等奖
  };

  const handleAwardClick = (award: IAward) => {
    const workKey = AWARD_TO_WORK[award.id];
    if (workKey) {
      registerLock('works-dialog', true);
      openDialog(workKey);
    }
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
            {MOCK_AWARDS.map((award: IAward, idx: number) => {
              const linkedWork = AWARD_TO_WORK[award.id];
              const clickable = Boolean(linkedWork);
              return (
                <StaggerItem
                  key={award.id}
                  delay={0.2 + idx * 0.08}
                  offsetMultiplier={0.8}
                  enterScale={1.01}
                >
                  <div
                    onClick={clickable ? () => handleAwardClick(award) : undefined}
                    className={[
                      'group relative border rounded-2xl p-6 md:p-8 bg-white/[0.02] backdrop-blur-sm transition-all',
                      clickable
                        ? 'cursor-pointer hover:bg-white/[0.06] hover:border-white/30 hover:-translate-y-0.5'
                        : 'border-white/15 hover:bg-white/[0.05] hover:border-white/25',
                    ].join(' ')}
                    role={clickable ? 'button' : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onKeyDown={clickable
                      ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAwardClick(award); } }
                      : undefined}
                  >
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
                      </div>
                      {clickable && (
                        <div className="shrink-0 self-start size-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/50 group-hover:bg-white/10 transition-all">
                          <ArrowUpRight className="size-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
