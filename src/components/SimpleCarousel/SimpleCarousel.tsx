import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export interface SimpleCarouselItem {
  image: string;
  caption?: string;
}

interface SimpleCarouselProps {
  items: SimpleCarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showCaptions?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export default function SimpleCarousel({
  items,
  autoplay = false,
  autoplayDelay = 4,
  showCaptions = true,
  showControls = true,
  showIndicators = true,
  className = '',
}: SimpleCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timerRef = useRef<number | null>(null);

  const total = items.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );

  const handleNext = useCallback(() => {
    goTo(index + 1);
  }, [index, goTo]);

  const handlePrev = useCallback(() => {
    goTo(index - 1);
  }, [index, goTo]);

  // 自动播放
  useEffect(() => {
    if (!autoplay || hovering || total <= 1) return undefined;
    timerRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, autoplayDelay * 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoplay, autoplayDelay, hovering, total]);

  // 键盘支持
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

  const hasCaptions = items.some((item) => item.caption);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#0c0c0e] ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label="图片轮播"
    >
      {/* 图片层 */}
      {items.map((item, i) => (
        <Image
          key={i}
          src={item.image}
          alt={item.caption || `Slide ${i + 1}`}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
          draggable={false}
        />
      ))}

      {/* 加载占位：图片未加载时显示深灰底 */}
      <div
        className="absolute inset-0 bg-[#0c0c0e] -z-10"
        aria-hidden="true"
      />

      {/* Caption */}
      {showCaptions && hasCaptions && (
        <div className="absolute left-5 bottom-5 z-20 pointer-events-none">
          {items.map((item, i) =>
            item.caption ? (
              <span
                key={i}
                className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
                  i === index ? 'opacity-100' : 'opacity-0 absolute left-0 bottom-0'
                }`}
                aria-hidden={i === index ? undefined : true}
              >
                {item.caption}
              </span>
            ) : null,
          )}
        </div>
      )}

      {/* 左右控制按钮 */}
      {showControls && total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/30 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105"
            aria-label="上一张"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/30 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105"
            aria-label="下一张"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && total > 1 && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
          role="tablist"
          aria-label="幻灯片"
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`跳转到第 ${i + 1} 张`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
