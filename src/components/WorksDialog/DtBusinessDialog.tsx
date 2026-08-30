import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorksDialog } from './WorksDialogContext';

interface VideoItem {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}

const VIDEO_GALLERY: VideoItem[] = [
  {
    title: '奶茶店',
    description: '商业观察系列第一集',
    videoUrl: 'https://aka.doubaocdn.com/s/DcdbJWUCVQ',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/lZJ2rxkFGC',
    duration: '--:--',
  },
  {
    title: '小蓝灯',
    description: '商业观察系列第二集',
    videoUrl: 'https://aka.doubaocdn.com/s/cMAIhNnCyk',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/2E0o4Uk3CN',
    duration: '--:--',
  },
  {
    title: '茉莉花',
    description: '商业观察系列第三集',
    videoUrl: 'https://aka.doubaocdn.com/s/6bbzJrQlhM',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/jSUQDK1ngX',
    duration: '--:--',
  },
  {
    title: '牛肉',
    description: '商业观察系列第四集',
    videoUrl: 'https://aka.doubaocdn.com/s/GUGiWsOpVa',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/lZJ2rxkFGC',
    duration: '--:--',
  },
  {
    title: '车越来越重',
    description: '商业观察系列第五集',
    videoUrl: 'https://aka.doubaocdn.com/s/B1iDnziyL2',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/2E0o4Uk3CN',
    duration: '--:--',
  },
  {
    title: '便利店',
    description: '商业观察系列第六集',
    videoUrl: 'https://aka.doubaocdn.com/s/l0q2F2vht0',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/jSUQDK1ngX',
    duration: '--:--',
  },
  {
    title: '3000万的豪宅',
    description: '商业观察系列第七集',
    videoUrl: 'https://aka.doubaocdn.com/s/bhW1Q8u9z4',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/lZJ2rxkFGC',
    duration: '--:--',
  },
  {
    title: '4月15日',
    description: '商业观察系列第八集',
    videoUrl: 'https://aka.doubaocdn.com/s/1ZKeTNroo1',
    thumbnailUrl: 'https://aka.doubaocdn.com/s/2E0o4Uk3CN',
    duration: '--:--',
  },
];

function formatTime(t: number) {
  if (!Number.isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function DtBusinessDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const isOpen = openWork === 'dt-business-video';
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  const currentVideo = VIDEO_GALLERY[currentVideoIndex];

  const handlePrevVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev - 1 + VIDEO_GALLERY.length) % VIDEO_GALLERY.length);
  }, []);

  const handleNextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % VIDEO_GALLERY.length);
  }, []);

  const handleSelectVideo = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  // 标题打字机效果
  useEffect(() => {
    if (!currentVideo) return;
    setDisplayedTitle('');
    const text = currentVideo.title;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setDisplayedTitle(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [currentVideo]);

  // 切换视频自动播放
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const el = videoRef.current;
    el.load();
    el.play().catch(() => {});
  }, [currentVideoIndex, isOpen]);

  // 视频进度
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    const onTime = () => {
      if (el.duration) {
        setProgress((el.currentTime / el.duration) * 100);
        setCurrentTime(formatTime(el.currentTime));
      }
    };
    const onMeta = () => setDuration(formatTime(el.duration));
    const onEnded = handleNextVideo;
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnded);
    };
  }, [handleNextVideo]);

  // 关闭时暂停 & 重置
  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) videoRef.current.pause();
    }
  }, [isOpen]);

  // ESC 关闭
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeDialog]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center overflow-hidden p-4 sm:p-8"
          onClick={closeDialog}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl my-auto text-white rounded-[28px] overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              background:
                'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.06), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.04), transparent 50%), #0a0a0a',
            }}
          >
            {/* 动态背景漂浮形状 */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl"
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl"
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute left-1/2 top-1/3 w-40 h-40 rounded-full bg-white/[0.04] blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                  backgroundRepeat: 'repeat',
                }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 sm:px-10 py-6 sm:py-7 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
                <div className="text-white/40 text-[11px] uppercase tracking-[0.25em]">
                  DT Business Observer · 08 Episodes
                </div>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="group relative w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/80 hover:text-white transition-all flex items-center justify-center border border-white/5"
                aria-label="关闭"
              >
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  <X className="size-4" />
                </motion.div>
              </button>
            </div>

            {/* Body: 左右布局 */}
            <div
              ref={scrollRef}
              className="relative z-10 p-6 sm:p-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 justify-center">
                {/* 左侧：9:16 竖屏视频播放器 */}
                <div className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] shrink-0 mx-auto md:mx-0">
                  <motion.div
                    className="relative"
                    onMouseEnter={() => setIsHoveringVideo(true)}
                    onMouseLeave={() => setIsHoveringVideo(false)}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* 外层发光 */}
                    <div
                      className="absolute -inset-px rounded-[22px] transition-opacity duration-500"
                      style={{
                        background: isHoveringVideo
                          ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 70%)'
                          : 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 70%)',
                        filter: 'blur(18px)',
                        opacity: isHoveringVideo ? 1 : 0.6,
                      }}
                    />
                    <div className="relative rounded-[20px] overflow-hidden bg-black border border-white/10">
                      <div
                        className="relative w-full bg-black"
                        style={{ aspectRatio: '9 / 16' }}
                      >
                        <motion.video
                          key={currentVideo?.videoUrl}
                          ref={videoRef}
                          src={currentVideo?.videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="absolute inset-0 w-full h-full object-contain"
                          controlsList="nodownload"
                        />
                        {/* 四角 L 角标 */}
                        <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-white/50 pointer-events-none" />
                        <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-white/50 pointer-events-none" />
                        <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-white/50 pointer-events-none" />
                        <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-white/50 pointer-events-none" />

                        {/* EP 编号徽标 */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[11px] font-medium tracking-[0.2em] uppercase">
                          Ep. {String(currentVideoIndex + 1).padStart(2, '0')}
                        </div>

                        {/* 上一集 / 下一集按钮 */}
                        <button
                          type="button"
                          onClick={handlePrevVideo}
                          className="group absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center border border-white/20"
                          aria-label="上一集"
                        >
                          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextVideo}
                          className="group absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center border border-white/20"
                          aria-label="下一集"
                        >
                          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>

                      {/* 自定义进度条 */}
                      <div className="px-4 py-3 border-t border-white/10">
                        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden group">
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-white rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                          <motion.div
                            className="absolute top-0 h-full bg-white blur-sm rounded-full opacity-60"
                            style={{ width: `${progress}%` }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255_255_255_0.8)] opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `calc(${progress}% - 6px)` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-white/40 text-[11px] tabular-nums">
                          <span>{currentTime}</span>
                          <span>{duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 右侧：标题信息 + 章节列表 */}
                <div className="w-full md:flex-1 md:min-w-0 flex flex-col gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-white/30 text-[11px] uppercase tracking-[0.25em]">
                        Episode {String(currentVideoIndex + 1).padStart(2, '0')}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                      <div className="text-white/30 text-[11px] tabular-nums">
                        0{VIDEO_GALLERY.length} total
                      </div>
                    </div>
                    <h2
                      className="text-white font-medium leading-tight"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(32px, 5vw, 52px)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {displayedTitle}
                      <motion.span
                        className="inline-block w-[3px] h-[0.9em] bg-white ml-1 align-middle"
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
                        style={{
                          opacity: displayedTitle.length < (currentVideo?.title.length ?? 0) ? 1 : 0,
                        }}
                      />
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed max-w-md">
                      {currentVideo?.description}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/60 text-[11px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        Business
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/60 text-[11px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        Docuseries
                      </div>
                    </div>
                  </div>

                  {/* 分隔线 */}
                  <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

                  {/* 章节列表 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white/40 text-[11px] uppercase tracking-[0.25em]">
                        All Episodes
                      </div>
                      <div className="text-white/30 text-[11px] tabular-nums">
                        {VIDEO_GALLERY.length} videos
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                      {VIDEO_GALLERY.map((item, i) => {
                        const isActive = i === currentVideoIndex;
                        return (
                          <motion.button
                            key={i}
                            type="button"
                            onClick={() => handleSelectVideo(i)}
                            whileHover={{ x: 4 }}
                            className="group w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                            style={{
                              background: isActive
                                ? 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
                                : 'transparent',
                              borderLeft: isActive ? '2px solid #fff' : '2px solid transparent',
                            }}
                          >
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={`text-[13px] tabular-nums font-medium w-8 ${isActive ? 'text-white' : 'text-white/30'}`}
                              >
                                {String(i + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}
                                style={{ fontFamily: 'var(--font-heading)' }}
                              >
                                {item.title}
                              </div>
                              <div
                                className={`text-[11px] mt-0.5 truncate ${isActive ? 'text-white/50' : 'text-white/30'}`}
                              >
                                {item.description}
                              </div>
                            </div>
                            <div className="shrink-0">
                              {isActive ? (
                                <motion.div
                                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                  <Play className="w-3 h-3 text-black ml-0.5" fill="currentColor" />
                                </motion.div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white/60 group-hover:border-white/30 transition-all">
                                  <Play className="w-2.5 h-2.5 ml-0.5" fill="currentColor" />
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
