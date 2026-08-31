import StaggerItem from '@/components/Fullpage/StaggerItem';
import ScrollVelocity from '@/components/ScrollVelocity/ScrollVelocity';
import Image from '@/components/ui/image';

const PORTRAIT_URL = 'https://aka.doubaocdn.com/s/1qldIIwSsa';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full h-screen overflow-hidden bg-white"
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-10">
            <div className="flex-1 min-w-0">
              <StaggerItem delay={0.05} offsetMultiplier={0.8}>
                <span className="text-[13px] uppercase tracking-[0.2em] text-black/50">
                  01 — About
                </span>
              </StaggerItem>
              <div className="mt-4">
                <ScrollVelocity
                  texts={[
                    'Digital Media Artist',
                    'Interactive Designer',
                  ]}
                  speed={70}
                  fontSize="clamp(40px, 6.5vw, 88px)"
                  fontWeight={500}
                  letterSpacing="-0.02em"
                  lineHeight={1.05}
                  textClassName="text-black font-normal"
                  fadeEdges={true}
                  rowGap="0.12em"
                  gap="1.5em"
                  style={{ fontFamily: 'var(--font-heading)' }}
                />
              </div>
            </div>

            {/* 装饰视频 */}
            <StaggerItem
              delay={0.35}
              offsetMultiplier={0.6}
              enterScale={1.02}
              className="shrink-0 w-full max-w-[360px] md:max-w-[420px] aspect-video bg-transparent mx-auto lg:mx-0 overflow-hidden"
            >
              <video
                src="./about-title-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-contain pointer-events-none"
              />
            </StaggerItem>
          </div>

          <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
            {/* 模拟工作证 */}
            <StaggerItem
              delay={0.6}
              offsetMultiplier={0.6}
              enterScale={1.02}
              className="shrink-0 mx-auto lg:mx-0 lg:mt-4 order-first lg:order-none"
            >
              <div className="relative w-[280px] sm:w-[300px] rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl backdrop-blur-md p-5 text-white overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_60px_-15px_rgba(0_0_0_0.6)] work-id-card">
                {/* 边缘光影流动 */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 work-id-glow" />

                {/* 挂绳孔 — 轻微摆动 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-black border-b border-white/10 work-id-lanyard">
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-b-full border border-white/15 border-t-0 bg-zinc-900" />
                </div>

                {/* 顶部标题 */}
                <div className="pt-5 pb-3 flex items-center justify-between border-b border-white/10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Work ID
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    SIVA-2023-XCH
                  </span>
                </div>

                {/* 照片 + 信息 */}
                <div className="py-4 flex flex-col items-center">
                  <div className="relative w-[140px] h-[170px] rounded-2xl overflow-hidden border border-white/15 bg-zinc-800 mb-4">
                    <Image
                      src={PORTRAIT_URL}
                      alt="项诚皓"
                      className="w-full h-full object-cover work-id-photo"
                    />
                    {/* 微光晕 */}
                    <div className="pointer-events-none absolute inset-0 work-id-photo-shine" />
                  </div>

                  <div
                    className="text-white font-bold text-center"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    项诚皓
                  </div>
                  <div className="text-white/50 text-[11px] mt-0.5 tracking-wide">
                    Xiang Chenghao
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 shrink-0 w-16">
                      Position
                    </span>
                    <span className="text-white/80 text-xs text-right flex-1 ml-3">
                      Digital Media Art Student
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 shrink-0 w-16">
                      School
                    </span>
                    <span className="text-white/80 text-xs text-right flex-1 ml-3">
                      Shanghai Institute of Visual Arts
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 shrink-0 w-16">
                      Major
                    </span>
                    <span className="text-white/80 text-xs text-right flex-1 ml-3">
                      Interaction Design / 3D Visual / Motion Graphics
                    </span>
                  </div>
                </div>

                {/* 条形码装饰 + 扫描线 */}
                <div className="mt-4 relative">
                  <div className="flex items-center justify-center gap-px">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white/60"
                        style={{
                          width: (i % 5 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1),
                          height: 24,
                        }}
                      />
                    ))}
                  </div>
                  {/* 扫描线 */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/70 shadow-[0_0_8px_rgba(255_255_255_0.8)] work-id-scanline" />
                  </div>
                </div>

                {/* 底部 */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] text-white/30 tracking-wider">
                    上海视觉艺术学院
                  </span>
                  <span className="text-[9px] text-white/30 font-mono">
                    2023 — 2027
                  </span>
                </div>

                <style>{`
                  @keyframes workIdBreathe {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.97; transform: scale(1.008); }
                  }
                  @keyframes workIdLanyard {
                    0%, 100% { transform: translateX(-50%) rotate(-0.5deg); }
                    50% { transform: translateX(-50%) rotate(0.8deg); }
                  }
                  @keyframes workIdKenBurns {
                    0% { transform: scale(1) translate(0, 0); }
                    50% { transform: scale(1.06) translate(-1%, -0.5%); }
                    100% { transform: scale(1) translate(0, 0); }
                  }
                  @keyframes workIdScanline {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(24px); opacity: 0; }
                  }
                  @keyframes workIdShine {
                    0%, 100% { opacity: 0; transform: translateX(-100%) skewX(-15deg); }
                    50% { opacity: 0.15; transform: translateX(100%) skewX(-15deg); }
                  }
                  .work-id-card {
                    animation: workIdBreathe 5s ease-in-out infinite;
                    transform-origin: top center;
                  }
                  .work-id-lanyard {
                    transform-origin: top center;
                    animation: workIdLanyard 3.5s ease-in-out infinite;
                  }
                  .work-id-photo {
                    animation: workIdKenBurns 12s ease-in-out infinite;
                  }
                  .work-id-scanline {
                    animation: workIdScanline 3s ease-in-out infinite;
                  }
                  .work-id-photo-shine {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    animation: workIdShine 6s ease-in-out infinite;
                  }
                  /* Hover 时略微加快节奏 */
                  .work-id-card:hover .work-id-photo {
                    animation-duration: 8s;
                  }
                  .work-id-card:hover .work-id-scanline {
                    animation-duration: 1.5s;
                  }
                  /* 减动效兼容 */
                  @media (prefers-reduced-motion: reduce) {
                    .work-id-card,
                    .work-id-lanyard,
                    .work-id-photo,
                    .work-id-scanline,
                    .work-id-photo-shine {
                      animation: none !important;
                    }
                    .work-id-card:hover {
                      transform: none !important;
                    }
                  }
                `}</style>
              </div>
            </StaggerItem>

            <div className="space-y-5 flex-1 min-w-0 max-w-4xl">
              <StaggerItem delay={0.5} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  我是项诚皓，就读于上海视觉艺术学院数字媒体艺术专业大三。
                </p>
              </StaggerItem>
              <StaggerItem delay={0.58} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  在校系统学习交互设计、三维视觉创作、动态影像与后期合成，兼顾艺术审美与数字技术落地，能够独立完成从创意构思到视觉产出的完整项目流程。
                </p>
              </StaggerItem>

              <StaggerItem delay={0.66} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-medium pt-2">
                  我的创作理解
                </p>
              </StaggerItem>
              <StaggerItem delay={0.74} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  数字艺术是媒介迭代带来的艺术表达革命。
                </p>
              </StaggerItem>
              <StaggerItem delay={0.82} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  它不是传统艺术简单的数字化搬运，而是以代码、三维空间、交互逻辑构建全新的创作语言，重新定义创作者、作品与观众之间的关系。
                </p>
              </StaggerItem>
              <StaggerItem delay={0.9} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  传统艺术中观众是被动观看者；而数字艺术里，观众的点击、移动、选择，都可以成为作品生长的一部分。创作者不再只是单向输出，而是体验规则的搭建者。
                </p>
              </StaggerItem>
              <StaggerItem delay={0.98} offsetMultiplier={0.7}>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  在团队协作中，我擅长配合团队节奏完成分工；同时具备独立闭环完成项目的能力，希望把技术能力与创作热情投入每一次项目实践。
                </p>
              </StaggerItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
