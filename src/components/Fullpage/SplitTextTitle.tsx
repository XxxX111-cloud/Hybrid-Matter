import { motion } from 'framer-motion';
import { usePageTransition, directionToOffset } from './PageTransitionContext';

/**
 * 字符级标题翻页动画 — Apple / Awwwards 风格
 *
 * - 入场：字符从下方滑入 + 微缩放 + 淡入，stagger 从左到右
 * - 每个字符独立 initial/animate，不依赖父级 variants 传播，更可靠
 * - 翻页时通过 turnKey 强制重挂载，每次入场都重新播放
 *
 * 用法：
 *   <SplitTextTitle>Hello World</SplitTextTitle>
 */

interface SplitTextTitleProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  /** stagger 延迟（每字符），默认 35ms */
  staggerMs?: number;
  /** 位移幅度（px），默认 36 */
  offsetPx?: number;
  /** 入场缩放起始值，默认 1.08 */
  enterScale?: number;
  /** 入场动画总时长（秒），默认 0.85s */
  duration?: number;
}

export default function SplitTextTitle({
  children,
  className,
  style,
  as: Tag = 'h2',
  staggerMs = 35,
  offsetPx = 36,
  enterScale = 1.08,
  duration = 0.85,
}: SplitTextTitleProps) {
  const { direction, turnKey } = usePageTransition();
  const { x, y } = directionToOffset(direction, offsetPx);

  const chars = Array.from(children);
  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div;
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <MotionTag
      key={turnKey}
      className={className}
      style={style}
      aria-label={children}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${turnKey}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, x, y, scale: enterScale }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{
            duration,
            ease: EASE,
            delay: (i * staggerMs) / 1000,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </MotionTag>
  );
}
