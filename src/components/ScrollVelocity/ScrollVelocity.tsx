import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollVelocityRowProps {
  text: string;
  /** 速度（px/s），正数向右，负数向左 */
  speed: number;
  fontSize: string;
  fontWeight: number | string;
  letterSpacing: string;
  lineHeight: number;
  textClassName: string;
  gap: string;
  /** 用于控制播放/暂停（离开页面时暂停） */
  active: boolean;
}

/**
 * 单行无限滚动 — 用纯 CSS 宽度测量 + motion value 实现
 * 每行独立速度，奇数行反向形成交错感
 */
function ScrollVelocityRow({
  text,
  speed,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  textClassName,
  gap,
  active,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [singleWidth, setSingleWidth] = useState(0);

  // 测量一份文字的宽度
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId = 0;
    const measure = () => {
      // 复制了 3 份，每份 = total / 3
      const w = el.scrollWidth / 3;
      if (w > 0) setSingleWidth(w);
    };
    // 延后两次 rAF，等字体加载 + 布局稳定后再测量
    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(measure);
      });
    };
    scheduleMeasure();
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(el);
    window.addEventListener('resize', scheduleMeasure);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [text, fontSize, fontWeight, letterSpacing, gap]);

  const x = useTransform(baseX, (v) => {
    if (singleWidth === 0) return 0;
    // 循环：始终保持在 [-singleWidth, 0] 范围
    let wrapped = v % singleWidth;
    if (speed < 0 && wrapped > 0) wrapped -= singleWidth;
    if (speed > 0 && wrapped < -singleWidth) wrapped += singleWidth;
    return wrapped;
  });

  useAnimationFrame((_t, delta) => {
    if (!active || singleWidth === 0) return;
    const moveBy = speed * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className="whitespace-nowrap flex"
      style={{
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
        gap,
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn('inline-block shrink-0', textClassName)}
          style={{ x, paddingRight: gap }}
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
}

interface ScrollVelocityProps {
  /** 要滚动的文本数组，每项占一行；奇数行反向滚动 */
  texts: string[];
  /** 基础滚动速度（px/s），正数向右，负数向左。奇数行自动取反 */
  speed?: number;
  /** 字号（任意 CSS 值） */
  fontSize?: string;
  /** 字重 */
  fontWeight?: number | string;
  /** 字间距 */
  letterSpacing?: string;
  /** 行高 */
  lineHeight?: number;
  /** 文字颜色 class */
  textClassName?: string;
  /** 左右边缘渐变遮罩（淡出效果） */
  fadeEdges?: boolean;
  /** 每行之间的 gap */
  rowGap?: string;
  /** 文字副本之间的 gap */
  gap?: string;
  /** 额外 className（外层容器） */
  className?: string;
  /** 外层容器 inline style（用于传入字体变量等） */
  style?: React.CSSProperties;
}

/**
 * 无限横向滚动跑马灯标题
 *
 * 特点：
 * - 每行独立速度控制，奇数行反向滚动形成交错感
 * - 复制 3 份文字实现无缝循环
 * - PPT 翻页模式下恒定速度滚动（无真实 scroll 也能工作）
 * - 通过 active prop 控制播放/暂停（离开页面时暂停节省性能）
 * - 左右边缘可选渐变遮罩淡出
 */
export default function ScrollVelocity({
  texts,
  speed = 80,
  fontSize = 'clamp(48px, 8vw, 120px)',
  fontWeight = 700,
  letterSpacing = '-0.02em',
  lineHeight = 1.1,
  textClassName = 'text-black',
  fadeEdges = true,
  rowGap = '0.1em',
  gap = '1.2em',
  className,
  style,
}: ScrollVelocityProps) {
  // PPT 模式下始终 active（页面是否显示由 FullpageProvider 控制）
  // 组件卸载时 useAnimationFrame 自动停止，不需要额外控制
  const active = true;

  return (
    <div
      className={cn('w-full overflow-hidden', className)}
      style={{
        maskImage: fadeEdges
          ? 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)'
          : undefined,
        WebkitMaskImage: fadeEdges
          ? 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)'
          : undefined,
        lineHeight,
        ...style,
      }}
    >
      <div className="flex flex-col" style={{ gap: rowGap }}>
        {texts.map((text, i) => (
          <ScrollVelocityRow
            key={text + i}
            text={text}
            // 偶数行向左（speed 负数），奇数行向右
            speed={i % 2 === 0 ? -Math.abs(speed) : Math.abs(speed)}
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            textClassName={textClassName}
            gap={gap}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
