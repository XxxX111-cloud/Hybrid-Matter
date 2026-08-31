import { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';

const LOGO_URL = './logo-xh.png';

interface PreloaderProps {
  /** 退出动画开始时回调（用于同步触发主页面入场） */
  onExitStart?: () => void;
  /** 完全退出后回调 */
  onDone?: () => void;
  /** 进度推进总时长（ms），默认 3000 */
  progressDuration?: number;
  /** 100% 停留时长（ms），默认 600 */
  holdDuration?: number;
  /** 退出动画时长（ms），默认 1200 */
  exitDuration?: number;
  /** 最大兜底时间（ms），超过强制退出，默认 5000 */
  maxDuration?: number;
}

/**
 * 页面加载 Preloader — XH Logo 开场动画
 *
 * - 黑色全屏背景 + 中央白色 XH Logo
 * - Logo 从 scale(0.85) + opacity 0 淡入放大（0.9s，CSS 控制）
 * - 进度条 + 百分比：按固定时间轴推进，不受资源加载速度影响
 * - 到达 100% 后短暂停留，再整体放大淡出退场
 * - 每次刷新都完整播放
 * - 5s 兜底：极端情况下强制退出，避免卡死
 */
export default function Preloader({
  onExitStart,
  onDone,
  progressDuration = 3000,
  holdDuration = 600,
  exitDuration = 1200,
  maxDuration = 5000,
}: PreloaderProps) {
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let startTime = 0;
    let finished = false;

    const startExit = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(rafId);

      setProgress(100);

      // 100% 停留 holdDuration 后开始放大退场
      window.setTimeout(() => {
        setExiting(true);
        onExitStart?.();

        // 退出动画结束后隐藏
        window.setTimeout(() => {
          setHidden(true);
          onDone?.();
        }, exitDuration);
      }, holdDuration);
    };

    // 进度动画：按固定时间轴从 0 推进到 100%，不受 load 事件影响
    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      if (elapsed < progressDuration) {
        const t = elapsed / progressDuration;
        // easeOutCubic：先快后慢，结尾逐渐逼近
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(Math.round(eased * 100));
        rafId = window.requestAnimationFrame(tick);
      } else {
        startExit();
      }
    };

    rafId = window.requestAnimationFrame(tick);

    // 最大兜底时间：极端情况下强制退出
    const maxTimer = window.setTimeout(() => {
      startExit();
    }, maxDuration);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(maxTimer);
    };
  }, [onExitStart, onDone, progressDuration, holdDuration, exitDuration, maxDuration]);

  if (hidden) return null;

  return (
    <div className={`preloader preloader-scale-exit ${exiting ? 'is-exiting' : ''}`}>
      {/* Logo */}
      <div className="preloader-logo">
        <Image
          src={LOGO_URL}
          alt="XH"
          className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] object-contain select-none"
          draggable={false}
        />
      </div>

      {/* 进度条 */}
      <div className="preloader-progress-bar">
        <div
          className="preloader-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 百分比 */}
      <div className="preloader-percent">
        {progress}%
      </div>
    </div>
  );
}
