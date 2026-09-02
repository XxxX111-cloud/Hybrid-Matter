import { Award } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit-lite';
import { MOCK_AWARDS, type IAward } from '@/data/portfolio';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';
import Ferrofluid from '@/components/Ferrofluid/Ferrofluid';
import { useWorksDialog, type WorkDialogKey } from '@/components/WorksDialog/WorksDialogContext';

/**
 * 作品 id → 弹窗 key 的映射
 * 注意：MOCK_WORKS 中 id 是 'yitao'，但 WorksDialog 使用 'yi-tao' 作为 key
 */
const WORK_ID_TO_DIALOG_KEY: Record<string, WorkDialogKey> = {
  'prepped-food-spring': 'prepped-food-spring',
  'yitao': 'yi-tao',
  'throat-civilization': 'throat-civilization',
  'gfl-ar-dimension': 'gfl-ar-dimension',
  'dt-business-video': 'dt-business-video',
};

/**
 * 把描述文本中的《作品名》高亮显示（下划线 + 白色），作为"有对应作品"的视觉提示
 * 点击行为由外层卡片统一处理，此处不需要单独的 onClick
 */
function renderDetailHighlight(detail: string, hasWork: boolean) {
  if (!hasWork) {
    return <span>{detail}</span>;
  }

  const match = detail.match(/《([^》]+)》/);
  if (!match || !match[0]) {
    return <span>{detail}</span>;
  }

  const workName = match[1];
  const before = detail.slice(0, match.index);
  const after = detail.slice((match.index ?? 0) + match[0].length);

  return (
    <span>
      {before}
      <span className="text-white font-medium underline underline-offset-2 decoration-white/60 group-hover:decoration-white transition-all">
        《{workName}》
      </span>
      {after}
    </span>
  );
}

export default function AwardsSection() {
  const { openDialog } = useWorksDialog();

  const handleCardClick = (award: IAward) => {
    if (!award.workId) return;
    const dialogKey = WORK_ID_TO_DIALOG_KEY[award.workId];
    if (!dialogKey) return;
    logger.info('[Awards] 点击获奖卡片打开作品弹窗', {
      awardId: award.id,
      workId: award.workId,
      dialogKey,
    });
    openDialog(dialogKey);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, award: IAward) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(award);
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
              const hasWork = Boolean(award.workId);

              return (
                <StaggerItem
                  key={award.id}
                  delay={0.2 + idx * 0.08}
                  offsetMultiplier={0.8}
                  enterScale={1.01}
                >
                  <div
                    role={hasWork ? 'button' : undefined}
                    tabIndex={hasWork ? 0 : undefined}
                    onClick={hasWork ? () => handleCardClick(award) : undefined}
                    onKeyDown={hasWork ? (e) => handleCardKeyDown(e, award) : undefined}
                    className={[
                      'group relative border rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all',
                      hasWork
                        ? 'cursor-pointer bg-white/[0.02] border-white/15 hover:bg-white/[0.06] hover:border-white/30 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(255_255_255_0.08)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
                        : 'bg-white/[0.02] border-white/15',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-4 md:gap-6 pointer-events-none">
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
                          {renderDetailHighlight(award.detail, hasWork)}
                        </p>
                      </div>
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
