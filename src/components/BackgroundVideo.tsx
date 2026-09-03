import { useEffect, useRef } from 'react';
import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';

const SENSITIVITY = 0.8;
const VIDEO_URL = resolveAppUrl('/assets/hero-background.mp4');

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: '70% center' }}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={VIDEO_URL} type="video/mp4" />
    </video>
  );
}
