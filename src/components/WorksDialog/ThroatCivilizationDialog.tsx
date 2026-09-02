import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Wrench, Cpu } from 'lucide-react';
import SimpleCarousel from '@/components/SimpleCarousel/SimpleCarousel';
import { useWorksDialog } from './WorksDialogContext';
import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';
import { Image } from '@/components/ui/image';

const GALLERY = [
  { image: resolveAppUrl('/throat-photos/01_device_front.jpg'), caption: '装置正面全貌' },
  { image: resolveAppUrl('/throat-photos/02_device_overview.jpg'), caption: '展览现场全貌' },
  { image: resolveAppUrl('/throat-photos/03_screen_mouth_detail.jpg'), caption: '屏幕流体与嘴巴近景' },
  { image: resolveAppUrl('/throat-photos/04_device_side.jpg'), caption: '装置侧面与交互部件' },
  { image: resolveAppUrl('/throat-photos/05_circuit_arduino.jpg'), caption: 'Arduino 电路系统细节' },
  { image: resolveAppUrl('/throat-photos/06_wood_structure.jpg'), caption: '木结构与气管舵机' },
  { image: resolveAppUrl('/throat-photos/07_wood_frame_build.jpg'), caption: '木结构框架搭建过程' },
  { image: resolveAppUrl('/throat-photos/08_build_process.jpg'), caption: '团队搭建调试现场' },
];

const VIDEO_URL = 'https://aka.doubaocdn.com/s/Yilds6r7lr';
const COVER_URL = 'https://aka.doubaocdn.com/s/FUZWRGVhde';

const SECTIONS = [
  {
    title: '核心理念',
    body: '在当代数字语境中，语言成为技术结构中的软性暴力。语言早已不是中性的表达工具，而是权力运作与情绪规训的结构载体。网络平台上的表达被算法裁定、流量引导、模板化组织，语言逐渐丧失创造性与多样性，转而演化为驯服情绪、约束行为的隐形工具。《喉间文明》正是对这种语言结构中"奴化"机制的视觉化与身体化反思。',
  },
  {
    title: '制作理念',
    body: '作品核心结构为一具模拟胃体的实体装置，外层为半透明硅胶材料包裹老式 CRT 显示终端，内设舵机与气泵，形成类似"吞咽—消化—胀痛"的生理回馈系统。舵机结构会根据屏幕中语言密度与情绪强度进行机械响应，体现语言在现实中的压迫效应。这种虚拟—现实的闭环机制试图回答一个问题：个体是否在"不断说话"的同时，也在被语言逐步格式化、去主体化？',
  },
  {
    title: '视觉系统',
    body: '显示器内，由 TouchDesigner 驱动的系统会实时爬取网络评论数据，关键词如"服从""管住嘴""你不配"等情绪化语言不断下坠、爆炸、融化为 emojis，最终变形、堆积于屏幕角落。语言的暴力在此不再抽象，它成为持续冲击胃部的"物理实体"。Python 实时爬虫社交平台的评论区，呈现给参观者。',
  },
  {
    title: '交互系统',
    body: '识别人数和人距离的远近，画面会由模糊到清晰，呈现内容也会发生变化。检测有人靠近时画面会由抽象的胃液变为稍微清晰但扭曲的文字，检测到多个人时会逐渐变成 emoji，当群体集聚，语言降维为 emoji，情绪被压缩为社交模板，越多人关注，语言越被社会重组为不可言说之物。',
  },
  {
    title: '技术实现',
    items: [
      '装置结构：木材构建"胃"的内部结构与整体框架，TPU 材料制作气囊，模拟胃消化语言的蠕动效果',
      '舵机控制：Arduino + L298N 电机驱动器，控制 10 个气泵和 5 个舵机，实现气囊呼吸性运动',
      'TouchDesigner：实时语音识别（科大讯飞），文字掉落效果，肉眼 3D 文字掉落',
      'Python：实时爬虫社交平台评论区',
      'vvvv：控制舵机运动，音频 FFT 分析映射到舵机角度，模拟人在说话的行为模式',
      'AI 声音模型：GPT-SoVITS 训练 AI 人声，五种情绪（愤怒、焦虑、遗憾等）',
      '3D 建模：雕刻及纹理绘制渲染',
    ],
    personalNote:
      '个人职责：项诚皓主导装置整体搭建以及 Arduino 交互系统模块的完整设计与实现——包括基于 Arduino Uno + L298N 电机驱动器的 10 路气泵与 5 路舵机控制电路、vvvv 舵机运动轨迹编程与音频 FFT 实时映射、木质胃体框架结构的搭建与机械调试，以及整套虚拟—现实闭环系统的联调与优化。',
  },
  {
    title: '艺术语境',
    body: '语法是再现过程的符号？我们希望更加直观地展现语言的力量，将无形的语言转化为有形的可观的。胃作为另一个情绪器官，更容易对阴影产生条件反应。语言从嘴巴脱口而出，聆听者就像将诉说者的语言给吃了下去，由胃进行处理，而脱离了大脑的思考和耳朵传递的原始条件，嘴巴和胃所展现的条件反射的反应便是语言负面力量的可视化展现。',
  },
  {
    title: '作品亮点',
    body: '从一开始宽泛的语言压力到最终的评论区语言暴力，选题慢慢深入到了一个具体的且比较完善的部分，并结合了胃这一情绪器官作为主体，表现人将语言暴力吃进肚子，并逐渐消化的这一过程。从人的形象转化为人身上的一部分，再到内部的一部分，再到抽象的一部分，逐渐将语言暴力这个关键的核心问题更加明显地展现在装置身上。',
  },
];

export default function ThroatCivilizationDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const isOpen = openWork === 'throat-civilization';

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
                  Interactive Installation Art · 2025
                </div>
                <h3
                  className="text-white font-medium"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    lineHeight: 1.2,
                  }}
                >
                  喉间文明 · Throat Civilization
                </h3>
                <p className="text-white/60 text-sm mt-2">
                  第十届"汇创青春"综合类（新实验及装置）三等奖 / 国际赛优胜奖
                </p>
                <p className="text-white/40 text-xs mt-1">
                   作者：项诚皓、郑伊伊、罗怡伟、张玥、秦文渊、朱奕恒
                 </p>
                 <div className="flex flex-wrap gap-2 mt-3">
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs">
                     <Wrench className="size-3.5" />
                     装置搭建
                   </span>
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs">
                     <Cpu className="size-3.5" />
                     Arduino 交互系统
                   </span>
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
                {/* Video */}
                <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                {videoError ? (
                  <div
                    className="w-full bg-black flex flex-col items-center justify-center relative"
                    style={{ minHeight: '280px', maxHeight: '42vh' }}
                  >
                    <Image
                      src={COVER_URL}
                      alt="喉间文明 视频封面"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="relative z-10 text-center space-y-2 px-6">
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <p className="text-white/70 text-sm">视频暂不可用</p>
                      <p className="text-white/40 text-xs">可查看下方 Gallery 了解装置细节</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full bg-black flex items-center justify-center"
                    style={{ maxHeight: '42vh' }}
                  >
                    <video
                      ref={videoRef}
                      src={VIDEO_URL}
                      controls
                      loop
                      playsInline
                      preload="metadata"
                      poster={COVER_URL}
                      onError={() => setVideoError(true)}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '42vh' }}
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <div className="text-white/50 text-xs uppercase tracking-[0.2em] mb-3">
                  Gallery — 8 works
                </div>
                <div
                  className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0e]"
                  style={{ height: 'min(38vh, 480px)', minHeight: '280px' }}
                >
                  <SimpleCarousel
                    items={GALLERY}
                    autoplay
                    autoplayDelay={4}
                    showCaptions
                    showControls
                    showIndicators
                  />
                </div>
              </div>

              {/* Description sections */}
              <div className="border-t border-white/10 pt-6 space-y-6">
                {SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <h4
                      className="text-white font-medium"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(16px, 1.8vw, 20px)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {section.title}
                    </h4>
                    {'body' in section ? (
                      <p className="text-white/70 text-sm leading-relaxed">
                        {section.body}
                      </p>
                    ) : (
                      <ul className="text-white/70 text-sm leading-relaxed space-y-1.5 list-disc list-inside">
                        {section.items?.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.personalNote && (
                      <p className="text-white/80 text-sm leading-relaxed pt-3 mt-3 border-t border-white/10">
                        {section.personalNote}
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
