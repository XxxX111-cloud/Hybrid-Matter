import { motion } from 'framer-motion';

export type MaskShape = 'circle-center' | 'circle-bottom-right' | 'inset-bottom' | 'inset-left' | 'polygon-diamond';

interface ClipMaskOverlayProps {
  shape: MaskShape;
  /** 遮罩颜色，默认白色 */
  color?: string;
  /** 单边时长（秒），扩展/收缩各这么多，默认 0.55s */
  duration?: number;
}

/**
 * Clip-path 几何遮罩过渡层 — Apple 产品发布页 / Awwwards 风格
 *
 * 配合 AnimatePresence 使用：
 * - 挂载：从 hidden → full（扩展动画，initial→animate）
 * - 卸载：从 full → hidden（收缩动画，animate→exit）
 * - 多种形状：圆形居中 / 圆形右下 / 矩形从下 / 矩形从左 / 菱形
 */
export default function ClipMaskOverlay({
  shape,
  color = '#ffffff',
  duration = 0.55,
}: ClipMaskOverlayProps) {
  const getClipPath = (phase: 'hidden' | 'full'): string => {
    switch (shape) {
      case 'circle-center':
        return `circle(${phase === 'full' ? '150%' : '0%'} at 50% 50%)`;
      case 'circle-bottom-right':
        return `circle(${phase === 'full' ? '150%' : '0%'} at 100% 100%)`;
      case 'inset-bottom':
        return phase === 'full'
          ? 'inset(0% 0% 0% 0%)'
          : 'inset(100% 0% 0% 0%)';
      case 'inset-left':
        return phase === 'full'
          ? 'inset(0% 0% 0% 0%)'
          : 'inset(0% 100% 0% 0%)';
      case 'polygon-diamond':
        return phase === 'full'
          ? 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)'
          : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';
      default:
        return `circle(${phase === 'full' ? '150%' : '0%'} at 50% 50%)`;
    }
  };

  const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

  return (
    <motion.div
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{ backgroundColor: color }}
      initial={{ clipPath: getClipPath('hidden') }}
      animate={{ clipPath: getClipPath('full') }}
      exit={{ clipPath: getClipPath('hidden') }}
      transition={{ duration, ease: EASE }}
    />
  );
}
