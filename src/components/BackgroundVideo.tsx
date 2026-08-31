import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const SENSITIVITY = 0.8;
const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const isMobile = useIsMobile();
  // 视频加载失败 / 未加载时的浅色兜底，保证黑色文字可见（移动端微信里 CDN 视频常加载失败）
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // 移动端：自动循环播放，不依赖鼠标 scrub
    if (isMobile) {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('autoplay', '');
      video.setAttribute('loop', '');
      const tryPlay = () => {
        video.play().catch(() => {
          /* 移动端自动播放被拦截时静默，保持浅色兜底 */
        });
      };
      tryPlay();
      // 部分浏览器需要用户首次交互后才能播放
      const unlock = () => {
        tryPlay();
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('touchstart', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
      return () => {
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('click', unlock);
      };
    }

    const handleSeeked = () => {
      isSeekingRef.current = false;
      // If targetTime moved during the seek, apply the latest value
      const diff = Math.abs(targetTimeRef.current - video.currentTime);
      if (diff > 0.01 && video.duration > 0) {
        try {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const handleLoadedMetadata = () => {
      // Start near the beginning so the first scrub feels natural
      targetTimeRef.current = 0;
      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const handleMouseMove = (e: MouseEvent) => {
      if (!video || !video.duration || isNaN(video.duration) || video.duration <= 0) return;

      const currentX = e.clientX;
      const prevX = prevXRef.current;
      prevXRef.current = currentX;

      if (prevX === null) return;

      const delta = currentX - prevX;
      const timeDelta = (delta / window.innerWidth) * SENSITIVITY * video.duration;

      let next = targetTimeRef.current + timeDelta;
      if (next < 0) next = 0;
      if (next > video.duration) next = video.duration;
      targetTimeRef.current = next;

      // Only kick off a seek if one isn't already in flight
      if (!isSeekingRef.current) {
        try {
          isSeekingRef.current = true;
          video.currentTime = next;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        // 浅色兜底：视频未加载 / 加载失败 / 移动端微信拦截 CDN 时，保证黑色文字可见
        backgroundColor: videoFailed ? '#f0f0f0' : '#e8e8e8',
      }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        autoPlay={isMobile}
        loop={isMobile}
        onError={() => setVideoFailed(true)}
        onLoadedData={() => setVideoFailed(false)}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );
}
