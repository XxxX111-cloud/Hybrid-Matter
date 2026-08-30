import { motion } from 'framer-motion';
import { usePageTransition, directionToOffset } from './PageTransitionContext';

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** 入场延迟（秒），默认 0 */
  delay?: number;
  /** 位移幅度倍率（1 = 默认 24px），标题用更大倍率，正文/媒体用小倍率 */
  offsetMultiplier?: number;
  /** 入场起始缩放 */
  enterScale?: number;
  /** 退场结束缩放 */
  exitScale?: number;
  /** 动画时长（秒），默认 0.9 */
  duration?: number;
  style?: React.CSSProperties;
  /** HTML 标签 */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'span' | 'p';
}

/**
 * 错落动画单元 — LUSION 风格
 *
 * - 从 usePageTransition 读取方向和 turnKey
 * - turnKey 变化时重启动画（每次翻页都重新播放入场）
 * - 入场：位移 + 缩放 + 淡入
 * - 退场：由整页 opacity 淡出承载（元素级保持原位即可，整页渐隐带走）
 */
export default function StaggerItem({
  children,
  className,
  delay = 0,
  offsetMultiplier = 1,
  enterScale = 1,
  duration = 0.9,
  style,
  as = 'div',
}: StaggerItemProps) {
  const { direction, turnKey } = usePageTransition();
  const baseOffset = 24 * offsetMultiplier;
  const { x, y } = directionToOffset(direction, baseOffset);

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      key={turnKey}
      className={className}
      style={style}
      initial={{ opacity: 0, x, y, scale: enterScale }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
