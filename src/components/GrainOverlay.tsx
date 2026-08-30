/**
 * 全局噪点/胶片颗粒覆盖层
 *
 * - SVG feTurbulence noise 做细腻颗粒
 * - position: fixed / z-9999 / pointer-events-none
 * - steps 动画模拟胶片颗粒流动
 * - opacity 极低（0.04），不影响内容阅读
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
