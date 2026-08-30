import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useWorksDialog } from './WorksDialogContext';
import Image from '@/components/ui/image';

const VIDEO_URL = 'https://aka.doubaocdn.com/s/bahTk00qsx';
const POSTER_URL = 'https://aka.doubaocdn.com/s/8R8eQjZVo9';

interface PhaseImage {
  src: string;
  caption?: string;
  bgWhite?: boolean;
}

interface PhaseSubsection {
  subtitle: string;
  content: string;
  images?: PhaseImage[];
}

interface Phase {
  title: string;
  paragraphs?: string[];
  subsections?: PhaseSubsection[];
  note?: string;
  images?: PhaseImage[];
}

const IP_CHARACTERS = [
  { name: '石犁小将', attr: '石 · 农耕属性', src: 'https://aka.doubaocdn.com/s/TmysZq6QW5' },
  { name: '骨针小刺', attr: '骨 · 敏捷属性', src: 'https://aka.doubaocdn.com/s/o5JRSUXnSf' },
  { name: '石凿小尖', attr: '岩 · 格斗属性', src: 'https://aka.doubaocdn.com/s/CU8UVhaMkq' },
  { name: '锋矢猎手', attr: '岩 · 格斗属性', src: 'https://aka.doubaocdn.com/s/iMYXuouQaQ' },
  { name: '鼎纹力士', attr: '骨 · 格斗属性', src: 'https://aka.doubaocdn.com/s/6hyIcXtToT' },
  { name: '鬶足行者', attr: '陶 · 岩属性', src: 'https://aka.doubaocdn.com/s/9HNFElYzZY' },
  { name: '环玉游者', attr: '玉 · 飞行属性', src: 'https://aka.doubaocdn.com/s/9oQ8tOUCCn' },
];

const PHASES: Phase[] = [
  {
    title: '第一阶段 · 前期调研',
    subsections: [
      {
        subtitle: '广富林遗址公园付费转化率专题调研',
        content:
          '年游客总量约 300 万人次，付费游客约 60 万人次，付费转化率约 20%。\n免费流失率约 80%，约 240 万游客"进园但不付费"。\n\n六大问题：\n1. 文化叙事浅层\n2. 展陈体验陈旧\n3. IP 更新乏力\n4. 区位配套受限\n5. 免费模式反噬\n6. 客群结构老化\n\n核心洞察：这恰恰是 VR/AR 的用武之地——用数字手段将"看不懂的遗址"变为"可沉浸的故事"。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/8R8eQjZVo9', caption: '项目主视觉 · GFL-AR 次元纪封面' },
        ],
      },
    ],
  },
  {
    title: '第二阶段 · 市场调研',
    subsections: [
      {
        subtitle: '集换式卡牌市场',
        content:
          '国内集换式卡牌市场增速领跑全球，2024 年市场规模已达 263 亿元，2026 年预计突破 350 亿元，近五年年复合增长率高达 56.6%。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/aoZfwohdPn', caption: '卡牌市场规模数据图' },
        ],
      },
      {
        subtitle: '竞品分析',
        content: '宝可梦卡牌、游戏王卡牌、球星卡——成熟的集换式卡牌市场验证了玩法与商业价值。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/5zDHN0DoZs', caption: '竞品分析 · 宝可梦 / 游戏王 / 球星卡' },
        ],
      },
      {
        subtitle: '技术选型',
        content:
          '调研 Kivicube 的局限性：不支持多目标并行跟踪。因此最终选择 Unity VUFORIA 作为 AR 识别引擎，实现多卡牌同步识别与动画拼装。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/76ctd0S490', caption: 'KIVICUBE 技术调研' },
        ],
      },
    ],
  },
  {
    title: '第三阶段 · 玩法设计（核心迭代）',
    subsections: [
      {
        subtitle: '3.1 玩法方案 1.0 + 第一版废稿',
        content:
          '玩法方案 1.0：卡牌对战系统"文明对决"，属性设计（良渚 / 龙山 / 吴越克制关系），能力维度（历史底蕴 / 工艺匠心 / 文化融合）。\n\n第一版废稿 1.0 的 6 个 IP 角色：神面玉影、夹砂鼎仔、牌坊镇灵、芦絮飘飘、古土芽芽、渡陶水影。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/V3zDQ0kKR0', caption: '夹砂鼎仔 · 第一版废稿 IP' },
        ],
      },
      {
        subtitle: '3.2 技术迭代与挫折',
        content:
          '尝试通过摄像头检测卡牌倾斜角度来控制 AR 角色动作，但测试发现只依靠摄像头无法测量卡牌的倾斜角度信息，只能另辟蹊径改变玩法。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/DrUdAzBeBw', caption: '技术迭代 · 摄像头检测失败示意' },
        ],
      },
      {
        subtitle: '3.3 玩法方案 2.0 + 第二版 IP 角色',
        content:
          '玩法方案 2.0：三分式实体卡牌联动 AR 机制，将广富林史前文明拆解为三类独立可收集实体卡牌：文物人物精灵卡、场景卡、动作卡。\n用户搭配三类卡牌组合，手机扫描卡组后，Unity AR Foundation 渲染一套专属连贯 3D 动画。\n\n第二版 2.0 的 7 个 IP 角色：石犁小将、骨针小刺、石凿小尖、锋矢猎手、鼎纹力士、鬶足行者、环玉游者。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/aF7irwvVlU', caption: '玩法方案 2.0 · 三分式卡牌联动 AR 机制图' },
        ],
      },
      {
        subtitle: 'IP Character Series',
        content:
          '广富林文明主题 3D 精灵系列 IP，以良渚玉璧、龙山陶器文物为原型打造，提炼轻量化神人兽面纹作为视觉符号。',
      },
      {
        subtitle: '3.4 卡牌设计 + 产品落地',
        content:
          '卡牌封面设计 3.0、卡牌背面设计 3.0、场景卡牌设计、动作卡牌设计。\n技术实现 2.0：通过 Unity 中的 VUFORIA 进行 AR 场景搭建。\n卡牌动画设计 1.0 / 2.0 迭代。\n\n产品说明：2mm 透明亚克力板材，UV 彩印，CNC 精准切割，10cm × 15cm，全套 18 张卡牌，总成本 90 元。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/iGMz4QaYbw', caption: '卡牌封面设计 3.0' },
          { src: 'https://aka.doubaocdn.com/s/XCfCX2PYkn', caption: '场景卡牌设计' },
          { src: 'https://aka.doubaocdn.com/s/HZrMGxY6kq', caption: '产品说明 · 亚克力卡牌制作', bgWhite: true },
          { src: 'https://aka.doubaocdn.com/s/LA4ksfvl7d', caption: '产品效果图' },
          { src: 'https://aka.doubaocdn.com/s/hNYf2QEt61', caption: '布展效果图' },
          { src: 'https://aka.doubaocdn.com/s/6h7VMsJqBJ', caption: '宣传海报' },
        ],
      },
    ],
  },
  {
    title: '第四阶段 · 商业闭环',
    subsections: [
      {
        subtitle: '引流 · 获客',
        content: 'AR 互动大屏、社交媒体传播。',
      },
      {
        subtitle: '变现',
        content: '售卖实体 AR 卡包（9.9 - 19.9 元 / 包）、景区餐饮合作、优惠券。',
      },
      {
        subtitle: '后期发展',
        content: '卡牌交换与交易、线下赛事运营。',
        images: [
          { src: 'https://aka.doubaocdn.com/s/fzq7BDPY54', caption: '商业闭环 · 后期发展规划图' },
        ],
      },
    ],
  },
];

function ImageScrollStrip({ images }: { images?: PhaseImage[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div
      className="w-full -mx-2 px-2 overflow-x-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.25) transparent',
      }}
    >
      <style>{`
        .gfl-scroll-strip::-webkit-scrollbar {
          height: 6px;
        }
        .gfl-scroll-strip::-webkit-scrollbar-track {
          background: transparent;
        }
        .gfl-scroll-strip::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }
        .gfl-scroll-strip::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.35);
        }
      `}</style>
      <div className="gfl-scroll-strip flex gap-3 pb-3 min-w-0">
        {images.map((img) => (
          <figure
            key={img.src}
            className={`shrink-0 group relative overflow-hidden rounded-xl border ${
              img.bgWhite
                ? 'bg-white border-black/10'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <Image
              src={img.src}
              alt={img.caption ?? ''}
              loading="lazy"
              className="h-[180px] sm:h-[220px] w-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {img.caption && (
              <figcaption
                className={`absolute bottom-0 left-0 right-0 px-3 py-2 text-xs transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                  img.bgWhite
                    ? 'text-black/85 bg-gradient-to-t from-white/90 via-white/50 to-transparent'
                    : 'text-white/85 bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                }`}
              >
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

function IPCharacterStrip() {
  return (
    <div
      className="w-full -mx-2 px-2 overflow-x-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.25) transparent',
      }}
    >
      <style>{`
        .gfl-ip-strip::-webkit-scrollbar {
          height: 6px;
        }
        .gfl-ip-strip::-webkit-scrollbar-track {
          background: transparent;
        }
        .gfl-ip-strip::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }
        .gfl-ip-strip::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.35);
        }
      `}</style>
      <div className="gfl-ip-strip flex gap-4 pb-3 min-w-0">
        {IP_CHARACTERS.map((ch) => (
          <figure
            key={ch.name}
            className="shrink-0 group relative overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <Image
              src={ch.src}
              alt={ch.name}
              loading="lazy"
              className="h-[220px] sm:h-[260px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 px-3 py-2 text-white/85 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
              <div className="text-sm font-medium">{ch.name}</div>
              <div className="text-[11px] text-white/60">{ch.attr}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function GflArDimensionDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOpen = openWork === 'gfl-ar-dimension';

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeDialog]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          onClick={closeDialog}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl my-auto bg-black text-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 sm:px-8 py-6 sm:py-7 border-b border-white/10">
              <div className="pr-14">
                <div className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">
                  AR Interactive Design · 2025
                </div>
                <h3
                  className="text-white font-medium"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(22px, 3vw, 34px)',
                    lineHeight: 1.2,
                  }}
                >
                  GFL-AR次元纪
                </h3>
                <p className="text-white/70 text-sm mt-2">
                  广富林文明主题多卡牌组合 AR 交互设计
                </p>
                <p className="text-white/40 text-xs mt-1">
                  地点：广富林遗址公园 · 团队：项诚皓 / 李茗宇 / 秦文渊 / 朱奕恒
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 flex items-center justify-center"
                aria-label="关闭"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-8 max-h-[85vh] overflow-y-auto">
              {/* Introduction */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <h4
                    className="text-white font-medium"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(16px, 1.8vw, 20px)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    项目概述
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    本作品是广富林文明主题多卡牌组合 AR 交互设计，以良渚玉璧、龙山陶器文物为原型打造 3D 精灵系列 IP，
                    提炼轻量化神人兽面纹作为视觉符号。项目划分人物、场景、动作三类亚克力实体卡牌，依托 Unity VUFORIA 实现多卡牌同步识别，
                    卡牌搭配可拼接连贯文明动画，创造卡牌的新型呈现方式。
                  </p>
                </div>

                <div className="space-y-3">
                  <h4
                    className="text-white font-medium"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(16px, 1.8vw, 20px)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    项目分工
                  </h4>

                  {/* 项诚皓 — 项目负责人，突出大卡片 */}
                  <div className="relative p-5 sm:p-6 rounded-2xl border bg-white/[0.04] border-white/20 overflow-hidden">
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium tracking-wider uppercase border border-white/20">
                      Lead · 项目负责人
                    </div>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span
                        className="text-white font-bold"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(20px, 2.5vw, 26px)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        项诚皓
                      </span>
                      <span className="text-white/40 text-xs">Xiang Chenghao</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex gap-3 text-white/80 text-sm leading-relaxed">
                        <span className="shrink-0 text-white/60 font-semibold mt-0.5">01</span>
                        <div>
                          <span className="text-white font-medium">项目前期构想</span>
                          <span className="text-white/60"> · 与李茗宇共同构思项目方向，确定广富林文明主题多卡牌组合 AR 交互设计的核心概念，完成从 0 到 1 的项目立项与概念设计</span>
                        </div>
                      </li>
                      <li className="flex gap-3 text-white/80 text-sm leading-relaxed">
                        <span className="shrink-0 text-white/60 font-semibold mt-0.5">02</span>
                        <div>
                          <span className="text-white font-medium">项目后期完善</span>
                          <span className="text-white/60"> · 参与项目后期的完善工作，与团队成员共同推进项目落地，协调各模块的整合与优化</span>
                        </div>
                      </li>
                      <li className="flex gap-3 text-white/80 text-sm leading-relaxed">
                        <span className="shrink-0 text-white/60 font-semibold mt-0.5">03</span>
                        <div>
                          <span className="text-white font-medium">项目 PPT 制作</span>
                          <span className="text-white/60"> · 独立完成项目汇报 PPT 的全程制作，包括内容策划、视觉设计、排版布局、数据可视化等，呈现完整的项目逻辑与成果</span>
                        </div>
                      </li>
                      <li className="flex gap-3 text-white/80 text-sm leading-relaxed">
                        <span className="shrink-0 text-white/60 font-semibold mt-0.5">04</span>
                        <div>
                          <span className="text-white font-medium">IP 形象建模 & 动画场景动作设计</span>
                          <span className="text-white/60"> · 负责第二版 2.0 的 7 个 IP 角色（石犁小将、骨针小刺、石凿小尖、锋矢猎手、鼎纹力士、鬶足行者、环玉游者）的 3D 建模，以及动画场景和动作设计制作，赋予广富林出土文物以鲜活的数字生命</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* 其他成员 — 简洁小卡片 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="text-white font-medium text-sm mb-1.5">李茗宇</div>
                      <div className="text-white/50 text-xs leading-relaxed">
                        Unity AR 交互程序编写
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="text-white font-medium text-sm mb-1.5">朱奕恒</div>
                      <div className="text-white/50 text-xs leading-relaxed">
                        视觉卡牌 IP 形象设计
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="text-white font-medium text-sm mb-1.5">秦文渊</div>
                      <div className="text-white/50 text-xs leading-relaxed">
                        部分动画制作 · 宣传片剪辑制作
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="space-y-2">
                <h4
                  className="text-white font-medium"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(16px, 1.8vw, 20px)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  宣传视频
                </h4>
                <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                  <div
                    className="w-full bg-black flex items-center justify-center"
                    style={{ maxHeight: '42vh' }}
                  >
                    <video
                      ref={videoRef}
                      src={VIDEO_URL}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '42vh' }}
                    />
                  </div>
                </div>
              </div>

              {/* Phases — 四阶段完整过程 */}
              <div className="border-t border-white/10 pt-6 space-y-10">
                {PHASES.map((phase, phaseIdx) => (
                  <div key={phase.title} className="space-y-4">
                    <h4
                      className="text-white font-medium"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(16px, 1.8vw, 20px)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {phase.title}
                    </h4>

                    {phase.paragraphs &&
                      phase.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 20)}
                          className="text-white/70 text-sm leading-relaxed"
                        >
                          {p}
                        </p>
                      ))}

                    {phase.images && phase.images.length > 0 && (
                      <ImageScrollStrip images={phase.images} />
                    )}

                    {phase.subsections &&
                      phase.subsections.map((sub) => (
                        <div
                          key={sub.subtitle}
                          className="pl-4 border-l border-white/15 space-y-3"
                        >
                          <h5 className="text-white/90 text-sm font-medium">
                            {sub.subtitle}
                          </h5>
                          <div className="text-white/65 text-sm leading-relaxed whitespace-pre-line">
                            {sub.content}
                          </div>

                          {/* 第三阶段 3.3 下方插入 IP 角色横向滚动条 */}
                          {phaseIdx === 2 &&
                            sub.subtitle === 'IP Character Series' && (
                              <IPCharacterStrip />
                            )}

                          <ImageScrollStrip images={sub.images} />
                        </div>
                      ))}

                    {phase.note && (
                      <p className="text-white/80 text-sm leading-relaxed pt-3 mt-3 border-t border-white/10">
                        {phase.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
