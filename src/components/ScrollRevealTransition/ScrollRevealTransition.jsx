import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';

const VIDEO_URL = resolveAppUrl('/assets/transition-personal.mp4');

const ScrollRevealTransition = () => {
  const sectionRef = useRef(null);
  const revealRef = useRef(null);
  const videoRef = useRef(null);
  const skipBtnRef = useRef(null);

  const hasTriggeredRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const isLockedRef = useRef(false);
  const lockYRef = useRef(0);

  const timersRef = useRef({
    maxWait: null,
    playCheck: null,
    skipShow: null,
  });

  const [showSkip, setShowSkip] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const reveal = revealRef.current;
    const video = videoRef.current;
    const skipBtn = skipBtnRef.current;
    if (!section || !reveal || !video) return;

    // ---------- 工具：清所有定时器 ----------
    const clearAllTimers = () => {
      Object.keys(timersRef.current).forEach((k) => {
        if (timersRef.current[k]) {
          clearTimeout(timersRef.current[k]);
          timersRef.current[k] = null;
        }
      });
    };

    // ---------- 滚动锁定 / 解锁 ----------
    const lockScroll = () => {
      if (isLockedRef.current) return;
      isLockedRef.current = true;
      lockYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockYRef.current}px`;
      document.body.style.width = '100%';
    };

    const unlockScroll = () => {
      if (!isLockedRef.current) return;
      isLockedRef.current = false;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lockYRef.current);
    };

    // ---------- 完成转场（唯一出口） ----------
    const completeTransition = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      clearAllTimers();
      setShowSkip(false);
      setProgress(1);

      const sectionBottom = section.offsetTop + section.offsetHeight;

      // 面板向上滑出
      gsap.to(reveal, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // 解锁并跳到 About
          unlockScroll();
          window.scrollTo({ top: sectionBottom + 4, behavior: 'auto' });
        },
      });
    };

    // ---------- 视频事件 ----------
    const handleVideoEnd = () => {
      completeTransition();
    };

    const handleTimeUpdate = () => {
      if (video.duration && video.duration > 0) {
        setProgress(video.currentTime / video.duration);
      }
    };

    const handleError = () => {
      if (hasTriggeredRef.current) completeTransition();
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    // ---------- 跳过按钮点击 ----------
    const handleSkipClick = () => {
      completeTransition();
    };
    if (skipBtn) {
      skipBtn.addEventListener('click', handleSkipClick);
    }

    // ---------- 启动转场 ----------
    const startTransition = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      // 1. 锁定滚动
      lockScroll();

      // 2. 面板从底部滑入
      gsap.to(reveal, {
        yPercent: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => {
          // 3. 尝试播放视频
          try {
            const p = video.play();
            if (p && typeof p.catch === 'function') {
              p.catch(() => {
                // 播放被拦截：3 秒兜底
                if (!hasCompletedRef.current) {
                  timersRef.current.playCheck = setTimeout(() => {
                    completeTransition();
                  }, 3000);
                }
              });
            }
          } catch (_e) {
            // 极端情况下 play() 抛错，也走兜底
            timersRef.current.playCheck = setTimeout(() => {
              completeTransition();
            }, 3000);
          }

          // 4. 3.5 秒兜底：检测到还在 paused 就直接完成
          timersRef.current.playCheck = setTimeout(() => {
            if (!hasCompletedRef.current && video.paused) {
              completeTransition();
            }
          }, 3500);

          // 5. 8 秒硬兜底：无论如何都完成
          timersRef.current.maxWait = setTimeout(() => {
            completeTransition();
          }, 8000);

          // 6. 2 秒后显示跳过按钮
          timersRef.current.skipShow = setTimeout(() => {
            if (!hasCompletedRef.current) {
              setShowSkip(true);
            }
          }, 2000);
        },
      });
    };

    // ---------- 滚动监听触发 ----------
    const handleScroll = () => {
      if (hasTriggeredRef.current || hasCompletedRef.current) return;

      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // 转场区顶部进入视口 70% 时启动
      if (rect.top <= viewportH * 0.7 && rect.bottom > 0) {
        startTransition();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始检查（防止页面已在转场区）
    handleScroll();

    // ---------- 清理 ----------
    return () => {
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      if (skipBtn) {
        skipBtn.removeEventListener('click', handleSkipClick);
      }
      clearAllTimers();
      if (isLockedRef.current) {
        unlockScroll();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* 转场面板：初始在屏幕下方（y-full） */}
      <div
        ref={revealRef}
        className="absolute inset-0 w-full h-full bg-black translate-y-full"
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 跳过按钮 */}
        {showSkip && (
          <button
            ref={skipBtnRef}
            type="button"
            className="absolute top-6 right-6 z-20 px-4 py-2 text-white/70 text-xs tracking-[0.2em] border border-white/25 rounded-full hover:bg-white hover:text-black transition-all duration-200"
          >
            Skip →
          </button>
        )}

        {/* 底部进度提示 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span
            className="text-white/40 text-[11px] tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Transition
          </span>
          <div className="w-40 h-[1.5px] bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/70 rounded-full transition-[width] duration-150 ease-linear"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollRevealTransition;
