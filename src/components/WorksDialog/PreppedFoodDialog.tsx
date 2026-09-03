import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import SimpleCarousel from '@/components/SimpleCarousel/SimpleCarousel';
import { useWorksDialog } from './WorksDialogContext';

const SLIDES = [
  { image: resolveAppUrl('/assets/ezB4Vhaf8l.jpg'), caption: '作品展示 1' },
  { image: resolveAppUrl('/assets/bwSHvIVTXA.jpg'), caption: '作品展示 2' },
  { image: resolveAppUrl('/assets/aAEl2adszA.png'), caption: '作品展示 3' },
];

export default function PreppedFoodDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOpen = openWork === 'prepped-food-spring';

  // 关闭时暂停视频
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  // ESC 关闭
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
            className="relative w-full max-w-6xl my-auto bg-black text-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 sm:px-8 py-6 sm:py-7 border-b border-white/10">
              <div className="pr-14">
                <div className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">
                  Projection Mapping · 2025
                </div>
                <h3
                  className="text-white font-medium"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    lineHeight: 1.2,
                  }}
                >
                  预制菜也有春天
                </h3>
                <p className="text-white/60 text-sm mt-2">
                  2025 重庆国际光影艺术节 Mapping 作品
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

              {/* Body: 视频 + 图片轮播 */}
            <div
              ref={scrollRef}
              className="p-6 sm:p-8 space-y-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Video Player */}
              <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                <div
                  className="w-full bg-black flex items-center justify-center"
                  style={{ maxHeight: '45vh' }}
                >
                  <video
                    ref={videoRef}
                    src={resolveAppUrl('/assets/MYXGUeP3N9.mp4')}
                    controls
                    playsInline
                    loop
                    preload="metadata"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '45vh' }}
                  />
                </div>
              </div>

              {/* Gallery 图片轮播（纯 CSS 淡入淡出，确保图片一定能显示） */}
              <div>
                <div className="text-white/50 text-xs uppercase tracking-[0.2em] mb-3">
                  Gallery
                </div>
                <div
                  className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0e]"
                  style={{ height: 'min(40vh, 480px)', minHeight: '280px' }}
                >
                  <SimpleCarousel
                    items={SLIDES}
                    autoplay
                    autoplayDelay={4}
                    showCaptions
                    showControls
                    showIndicators
                  />
                </div>
              </div>

              {/* Description */}
              <div className="text-white/70 text-sm leading-relaxed border-t border-white/10 pt-6 space-y-4">
                <p>
                  「预制菜也有春天」是 2025 重庆国际光影艺术节参展的 Projection Mapping 作品。
                  这篇散文 Mapping 呈现了创作者的内心独白，及与其 AI 造物的对话。
                </p>
                <p>
                  我们并不回避使用当今时兴的文生图像/视频等技术制作的了无生气的素材，
                  并通过繁复的印刷制作和精心的逐帧动画，为其重新赋予手工感和人味儿。
                  这个&quot;将锅气重新注入预制菜&quot;的过程成为了动画的拉丁文词源 animātiō
                  （赋予生命、精神、灵魂）在新兴技术潮流中的回响。
                </p>
                <p>
                  通过对 AI 的使用进行直白的探讨和诚恳的剖析，我们试图将其接纳为自身的一部分，
                  并借此触及了身处不同世代、使用不同媒介的创作者都必须面对的某些根本问题。
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
