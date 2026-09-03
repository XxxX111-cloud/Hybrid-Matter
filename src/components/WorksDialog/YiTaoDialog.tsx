import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useWorksDialog } from './WorksDialogContext';
import { Image } from '@/components/ui/image';

const VIDEO_URL = resolveAppUrl('/assets/yitao-demo.mp4');
const POSTER_URL = resolveAppUrl('/assets/yitao-poster.png');

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

const PHASES: Phase[] = [
  {
    title: '第一阶段 · 项目背景与前期调研',
    subsections: [
      {
        subtitle: '非遗文化传承',
        content:
          '陶艺作为非物质文化遗产，具有深厚的文化内涵和独特的艺术风格。陶瓷艺术在中国发源年代久远，样貌繁多，在世界历史上中国的陶瓷艺术一直是具有相当的代表性。由于传承年代久远，技术不断更新，历经朝代更迭，不同民族性与生活方式影响了中国陶瓷的发展方向。\n\n材料分析：红陶、普白瓷泥、黄陶等不同陶土材料的特性研究。',
        images: [
          { src: resolveAppUrl('/assets/yitao-material.png'), caption: '材料分析 · 红陶 / 普白瓷泥 / 黄陶' },
        ],
      },
      {
        subtitle: '前期调研分析',
        content:
          '《一起做陶艺》游戏调研：真实的捏陶瓷小游戏。局限：只能在平板、手机里下载。创新：利用投屏加上手势互动更具趣味性，手势互动更能还原出现实做陶艺。\n\n互动装置调研：参考各类交互装置艺术案例。\n手部扫描技术调研：通过机器扫描手部，实现手势识别与追踪。',
        images: [
          { src: resolveAppUrl('/assets/yitao-research-game.jpeg'), caption: '调研分析 · 《一起做陶艺》游戏' },
          { src: resolveAppUrl('/assets/yitao-game-show.jpeg'), caption: '游戏展示 · 陶艺作品展示' },
          { src: resolveAppUrl('/assets/yitao-interactive-ref.jpeg'), caption: '互动装置参考 · 裸眼 3D 大屏' },
          { src: resolveAppUrl('/assets/yitao-hand-scan.jpeg'), caption: '手部扫描技术调研' },
        ],
      },
    ],
  },
  {
    title: '第二阶段 · 作品概念与交互设计',
    subsections: [
      {
        subtitle: '灵感来源',
        content:
          '在和工美的朋友聊天中得到的灵感：她说这个天气好冷每次拉胚都要很频繁的洗手，真想赛博拉胚做陶瓷。想让现实陶瓷工艺用虚拟数字化呈现出来，做一个赛博陶瓷。',
        images: [],
      },
      {
        subtitle: '作品概念：《不脏手的陶艺》',
        content:
          '将传统陶艺与手势互动相结合。不仅体现了超现实艺术的融合，更在交互设计和互动体验中展现出无限可能，为非遗文化的传承与发展提供了新路径。艺术家们开始尝试将电子技术与传统陶艺相结合。作品既保留了陶艺的原始美感，又融入了现代科技元素。打破了现实与虚拟的界限，让观众在欣赏作品的同时，感受到一种超越现实的艺术体验。\n\n关键词：手部操控、互动、传统陶艺',
        images: [
          { src: resolveAppUrl('/assets/yitao-keyvisual.png'), caption: '《不脏手的陶艺》作品主视觉' },
        ],
      },
      {
        subtitle: '交互流程（四步）',
        content:
          '步骤 1：初始界面 —— 参观者可选择一个喜欢的材质，进行制作\n步骤 2：进入素胚状态进行塑造\n步骤 3：塑造完成\n步骤 4：最终成品可以展示、进行扫码保存',
        images: [
          { src: resolveAppUrl('/assets/yitao-ui-material.png'), caption: '初始界面 · 选择材质' },
          { src: resolveAppUrl('/assets/yitao-shaping.png'), caption: '素胚塑造 · 手势控制塑形' },
          { src: resolveAppUrl('/assets/yitao-final.png'), caption: '最终成品展示' },
        ],
      },
    ],
  },
  {
    title: '第三阶段 · 技术研究与实践',
    subsections: [
      {
        subtitle: '3D 多边形节点模型调研',
        content:
          '研究 3D 多边形节点模型的构建方式，为虚拟陶土的形变提供技术基础。',
        images: [
          { src: resolveAppUrl('/assets/yitao-polygon-model.png'), caption: '3D 多边形节点模型' },
        ],
      },
      {
        subtitle: 'PBRMaterial 材质调研',
        content:
          '研究基于物理的渲染材质（PBRMaterial），包括金属材质、浮雕材质等不同质感的实现。',
        images: [
          { src: resolveAppUrl('/assets/yitao-pbr-metal.png'), caption: 'PBRMaterial 材质 · 金属效果' },
        ],
      },
      {
        subtitle: '后期特效与材质探索',
        content:
          '研究泛光（Bloom）等后期特效，提升作品的视觉表现力。同时探索玻璃、漆皮、气泡等特殊材质，丰富陶艺作品的视觉多样性。',
        images: [
          { src: resolveAppUrl('/assets/yitao-fun-material.png'), caption: '有趣的材质 · 玻璃 / 漆皮 / 气泡' },
        ],
      },
      {
        subtitle: '数字跟踪点控制模型',
        content:
          '选取几个数字跟踪点为一组控制一圈模型环形点，实现通过手势控制点来驱动 3D 模型形变。例如：2、3、4、5、6、7、8 点为一组，13、14、15、16、17、18、19、20 点为另一组。',
        images: [
          { src: resolveAppUrl('/assets/yitao-tracking.png'), caption: '数字跟踪点控制模型示意' },
        ],
      },
      {
        subtitle: '初步实践成果',
        content:
          '展示平台的木质台面，还有一些分面很规整的瓷罐模型可当做背景。这些可以修改材质，可以放到 4v 里面塑形。实现了基础的手势交互与陶艺塑形功能。',
        images: [
          { src: resolveAppUrl('/assets/yitao-practice.png'), caption: '初步实践成果 · 陶土模型展示' },
        ],
      },
    ],
  },
  {
    title: '第四阶段 · 布展准备与成果展示',
    subsections: [
      {
        subtitle: '中期准备',
        content: '所需的布展道具：显示屏或投影仪等展示设备。',
        images: [],
      },
      {
        subtitle: '安装布置图',
        content: '草图展示：规划作品的空间布局与交互动线。',
        images: [
          { src: resolveAppUrl('/assets/yitao-layout-sketch.jpeg'), caption: '安装布置草图' },
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
        .yitao-scroll-strip::-webkit-scrollbar {
          height: 6px;
        }
        .yitao-scroll-strip::-webkit-scrollbar-track {
          background: transparent;
        }
        .yitao-scroll-strip::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }
        .yitao-scroll-strip::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.35);
        }
      `}</style>
      <div className="yitao-scroll-strip flex gap-3 pb-3 min-w-0">
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

export default function YiTaoDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOpen = openWork === 'yi-tao';

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
                  Interactive Installation · 2025
                </div>
                <h3
                  className="text-white font-medium"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(22px, 3vw, 34px)',
                    lineHeight: 1.2,
                  }}
                >
                  意陶 · YiTao
                </h3>
                <p className="text-white/70 text-sm mt-2">
                  《不脏手的陶艺》· 非遗数字化交互装置
                </p>
                <div className="text-white/40 text-xs mt-1 space-y-0.5">
                  <p>· 第 13 届未来设计师 NCDA 上海赛区二等奖（负责整体交互程序编写）</p>
                  <p>· 第 14 届未来设计师·全国高校数字艺术设计大赛省级赛陶瓷艺术与科技赛道上海赛区一等奖</p>
                </div>
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
              {/* Poster */}
              <div className="w-full rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10">
                <Image
                  src={POSTER_URL}
                  alt="意陶 · 作品海报"
                  className="w-full h-auto object-cover"
                />
              </div>

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
                    作品简介
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    《意陶》以手势为媒，捏塑无形之念。指尖流转间，虚拟陶土应势而生，将传统陶艺的"意"转化为数字交互的"形"，
                    在虚实相生中探讨手艺与科技的共生关系——心随意动，器由手成。
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    《意陶》将传统陶艺的方式转化为电子虚拟的形式，电子陶艺的设计灵感来源于生活，用传统的陶艺造型与现代的传感手势交互元素有机融合，
                    创造出富有创意和个性的艺术作品。陶艺作为非物质文化遗产，具有深厚的文化内涵和独特的艺术风格。
                    《意陶》既保留了陶艺的原始美感，又融入了现代科技元素。打破了现实与虚拟的界限，让观众在欣赏作品的同时，
                    感受到一种超越现实的艺术体验。
                  </p>
                </div>

                <div className="space-y-2">
                  <h4
                    className="text-white font-medium"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(16px, 1.8vw, 20px)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    灵感来源
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    在和工美的朋友聊天中得到的灵感：她说这个天气好冷每次拉胚都要很频繁的洗手，真想赛博拉胚做陶瓷。
                    想让现实陶瓷工艺用虚拟数字化呈现出来，做一个赛博陶瓷。
                  </p>
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
                  实践成果演示
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
                {PHASES.map((phase) => (
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
