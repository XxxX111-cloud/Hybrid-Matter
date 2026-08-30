import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, wrap } from 'motion/react';
import './Carousel.css';
import { Image } from '@/components/ui/image';

export interface CarouselItem {
  id: number | string;
  title: string;
  description?: string;
  thumbnail?: string;
  /** 可选：渲染自定义内容（优先级高于内置 thumbnail+文字） */
  render?: (active: boolean) => React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  /** 卡片基础宽度 */
  baseWidth?: number;
  /** 卡片高度（宽高比更直观，这里直接传高度） */
  cardHeight?: number;
  /** 卡片间距对应的角度偏移（deg），值越大卡间越疏 */
  angleStep?: number;
  /** 自动播放 */
  autoplay?: boolean;
  /** 自动播放间隔 ms */
  autoplayDelay?: number;
  /** 悬停暂停 */
  pauseOnHover?: boolean;
  /** 循环 */
  loop?: boolean;
  /** 圆角大小 px */
  round?: number;
  /** 初始选中索引 */
  initialIndex?: number;
  /** 选中变化回调 */
  onChange?: (index: number) => void;
  /** 暗色模式（适配深色背景） */
  dark?: boolean;
}

export default function Carousel({
  items,
  baseWidth = 220,
  cardHeight = 280,
  angleStep = 20,
  autoplay = true,
  autoplayDelay = 4000,
  pauseOnHover = true,
  loop = true,
  round = 16,
  initialIndex = 0,
  onChange,
  dark = false,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // 用 motion value 表示当前旋转角度（以卡片 0 居中为 0）
  const rotation = useMotionValue(-activeIndex * angleStep);
  const springRotation = useSpring(rotation, { stiffness: 120, damping: 20 });

  // 拖拽相关
  const dragX = useMotionValue(0);
  const isDragging = useRef(false);
  const dragStartRotation = useRef(0);
  const isHovering = useRef(false);
  const autoplayTimerRef = useRef<number | null>(null);

  const radius = useMemo(
    () => (baseWidth / 2) / Math.tan((angleStep * Math.PI) / 180 / 2) * 1.4,
    [baseWidth, angleStep],
  );

  // 切换到指定索引
  const goTo = useCallback(
    (index: number) => {
      let targetIndex = index;
      if (loop) {
        targetIndex = ((index % items.length) + items.length) % items.length;
      } else {
        targetIndex = Math.max(0, Math.min(items.length - 1, index));
      }
      const targetRotation = -targetIndex * angleStep;
      rotation.set(targetRotation);
      setActiveIndex(targetIndex);
      onChange?.(targetIndex);
    },
    [angleStep, items.length, loop, onChange, rotation],
  );

  // 下一个 / 上一个
  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // 自动播放
  useEffect(() => {
    if (!autoplay) return undefined;
    if (pauseOnHover && isHovering.current) return undefined;

    autoplayTimerRef.current = window.setTimeout(() => {
      next();
    }, autoplayDelay);

    return () => {
      if (autoplayTimerRef.current !== null) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [autoplay, autoplayDelay, pauseOnHover, activeIndex, next]);

  // 鼠标悬停暂停
  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    if (autoplayTimerRef.current !== null) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  // 拖拽处理
  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    dragStartRotation.current = rotation.get();
    // 暂停自动播放
    if (autoplayTimerRef.current !== null) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, [rotation]);

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      // 拖拽位移换算成旋转角度（根据半径粗估）
      const dragDeg = (info.offset.x / radius) * (180 / Math.PI) * -1.2;
      rotation.set(dragStartRotation.current + dragDeg);
      // 实时同步 activeIndex 为最近的整数索引
      const nearest = Math.round(-rotation.get() / angleStep);
      const normalized = ((nearest % items.length) + items.length) % items.length;
      if (normalized !== activeIndex) {
        setActiveIndex(normalized);
      }
    },
    [rotation, angleStep, items.length, radius, activeIndex],
  );

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    // 吸附到最近的卡片
    const nearest = Math.round(-rotation.get() / angleStep);
    goTo(nearest);
  }, [rotation, angleStep, goTo]);

  // 点击卡片：切换到对应索引
  const handleItemClick = useCallback(
    (index: number) => {
      if (isDragging.current) return;
      if (index === activeIndex) return;
      goTo(index);
    },
    [goTo, activeIndex],
  );

  // 指示器点击
  const handleDotClick = useCallback(
    (i: number) => {
      if (isDragging.current) return;
      goTo(i);
    },
    [goTo],
  );

  return (
    <div
      ref={containerRef}
      className={`carousel-root ${dark ? 'is-dark' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="carousel-stage"
        style={{
          perspective: 1200,
          perspectiveOrigin: '50% 50%',
          height: cardHeight + 80,
        }}
      >
        <motion.div
          className="carousel-track"
          style={{
            width: baseWidth,
            height: cardHeight,
            rotateY: springRotation,
            transformStyle: 'preserve-3d',
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          {items.map((item, i) => {
            const rotateY = i * angleStep;
            const isActive = i === activeIndex;

            return (
              <motion.div
                key={item.id}
                className={`carousel-item ${isActive ? 'is-active' : ''}`}
                style={{
                  width: baseWidth,
                  height: cardHeight,
                  rotateY,
                  translateZ: radius,
                  borderRadius: round,
                }}
                onClick={() => handleItemClick(i)}
              >
                {item.render ? (
                  item.render(isActive)
                ) : (
                  <div className="carousel-item-inner" style={{ borderRadius: round }}>
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        className="carousel-item-thumb"
                        draggable={false}
                      />
                    )}
                    <div className="carousel-item-overlay">
                      <div className="carousel-item-title">{item.title}</div>
                      {item.description && (
                        <div className="carousel-item-desc">{item.description}</div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* 指示器 */}
      <div className="carousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`跳转到第 ${i + 1} 个`}
          />
        ))}
      </div>
    </div>
  );
}
