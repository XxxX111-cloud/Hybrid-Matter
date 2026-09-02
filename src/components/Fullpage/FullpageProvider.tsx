import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageTransitionProvider, type TransitionDirection } from './PageTransitionContext';
import ClipMaskOverlay, { type MaskShape } from './ClipMaskOverlay';
import { cn } from '@/lib/utils';

interface FullpageContextValue {
  currentIndex: number;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  total: number;
  registerLock: (key: string, locked: boolean) => void;
  /**
   * 强制跳转，跳过 isAnimating 和 isLocked 检查
   * 用于用户明确点击按钮需要翻页的场景，保证一定能响应
   */
  forceGoTo: (index: number) => void;
}

export const FullpageContext = createContext<FullpageContextValue | null>(null);

export function useFullpage() {
  const ctx = useContext(FullpageContext);
  if (!ctx) throw new Error('useFullpage must be used within FullpageProvider');
  return ctx;
}

interface FullpageProviderProps {
  total: number;
  children: (index: number) => React.ReactNode;
  background?: React.ReactNode;
  chrome?: React.ReactNode;
  onIndexChange?: (index: number) => void;
  /** 每页的遮罩颜色（默认白色），按页索引传，保证与页面底色一致 */
  pageMaskColors?: string[];
}

// 遮罩单边时长（秒）—— 扩展 / 收缩各这么多
const MASK_HALF_DURATION = 0.55;
// 总锁定时长 = 扩展 + 收缩 + 一点 buffer
const TOTAL_LOCK_MS = MASK_HALF_DURATION * 2 * 1000 + 80;

/**
 * 5 段转场遮罩形状（正向翻页时）
 * - circle-center: 圆形从中心扩展（Apple 风格）
 * - inset-bottom: 矩形从底部向上扩展
 * - circle-bottom-right: 圆形从右下角扩展
 * - inset-left: 矩形从左向右扩展
 * - polygon-diamond: 菱形从中心扩展
 */
const MASK_SHAPES: MaskShape[] = [
  'circle-center',       // Hero → About
  'inset-bottom',        // About → Works
  'circle-bottom-right', // Works → Awards
  'inset-left',          // Awards → Skills
  'polygon-diamond',     // Skills → Contact
];

// 内容进入方向：与遮罩形状配对，让内容流动方向呼应遮罩扩展方向
const CONTENT_DIRECTIONS: TransitionDirection[] = [
  'up',       // Hero → About: 向上流动
  'up',       // About → Works: 从底部进入
  'center',   // Works → Awards: 缩放进入
  'right',    // Awards → Skills: 从右进入
  'center',   // Skills → Contact: 缩放进入
];

function getTransitionConfig(fromIndex: number, toIndex: number) {
  const forward = toIndex > fromIndex;
  const tIndex = Math.min(
    Math.max((forward ? toIndex : fromIndex) - 1, 0),
    MASK_SHAPES.length - 1,
  );
  const shape = MASK_SHAPES[tIndex];
  // 反向翻页时方向取反
  let dir = CONTENT_DIRECTIONS[tIndex];
  if (!forward) {
    switch (dir) {
      case 'up': dir = 'down'; break;
      case 'down': dir = 'up'; break;
      case 'left': dir = 'right'; break;
      case 'right': dir = 'left'; break;
      case 'center': break;
    }
  }
  return { shape, direction: dir };
}

export function FullpageProvider({ total, children, background, chrome, onIndexChange, pageMaskColors }: FullpageProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maskShape, setMaskShape] = useState<MaskShape>('circle-center');
  const [maskColor, setMaskColor] = useState('#ffffff');
  const [maskActive, setMaskActive] = useState(false);
  const [maskKey, setMaskKey] = useState(0);
  const [direction, setDirection] = useState<TransitionDirection>('up');
  const [turnKey, setTurnKey] = useState(0);
  const isAnimatingRef = useRef(false);
  const locksRef = useRef<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccumRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  const isLocked = useCallback(() => {
    return Object.values(locksRef.current).some(Boolean);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return;
      if (isLocked()) return;
      performTransition(index);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, total, isLocked],
  );

  /**
   * 强制翻页：跳过 isAnimating / isLocked 检查，立即执行转场
   *
   * 适用场景：用户在页面内通过明确的按钮点击触发翻页（如「查看作品」按钮），
   * 此时如果恰好处于动画收尾阶段或被某个锁意外锁住，普通 goTo 会静默 return，
   * 用户感觉「点了没反应」。forceGoTo 确保点击一定有响应。
   */
  const forceGoTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index));
      if (clamped === currentIndex) return;
      // 如果正在动画中，先重置标志位确保新转场能启动
      isAnimatingRef.current = false;
      performTransition(clamped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, total],
  );

  // 共享的转场执行逻辑
  const performTransition = useCallback(
    (clamped: number) => {
      isAnimatingRef.current = true;

      const { shape, direction: dir } = getTransitionConfig(currentIndex, clamped);

      // 遮罩颜色用目标页的背景色（默认白）
      const targetMaskColor = pageMaskColors?.[clamped] ?? '#ffffff';

      // 1. 先显示遮罩（扩展动画）
      setMaskShape(shape);
      setMaskColor(targetMaskColor);
      setDirection(dir);
      setMaskKey((k) => k + 1);
      setMaskActive(true);

      // 2. 遮罩完全覆盖后切换页面
      window.setTimeout(() => {
        setCurrentIndex(clamped);
        onIndexChange?.(clamped);
        setTurnKey((k) => k + 1);

        // 3. 让遮罩保持一帧再收缩（避免闪烁）
        window.requestAnimationFrame(() => {
          setMaskActive(false);
        });
      }, MASK_HALF_DURATION * 1000);

      // 4. 总时长后解锁
      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, TOTAL_LOCK_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, pageMaskColors, onIndexChange],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  const registerLock = useCallback((key: string, locked: boolean) => {
    locksRef.current[key] = locked;
  }, []);

  // 滚轮翻页
  useEffect(() => {
    const WHEEL_THRESHOLD = 30;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked()) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const path = e.composedPath();
      let scrollableEl: HTMLElement | null = null;
      for (const node of path) {
        if (node === containerRef.current) break;
        if (node instanceof HTMLElement) {
          const style = window.getComputedStyle(node);
          const overflowY = style.overflowY;
          if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1) {
            scrollableEl = node;
            break;
          }
        }
      }

      if (scrollableEl) {
        const scrollingDown = e.deltaY > 0;
        const atBottom =
          scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight - 1;
        const atTop = scrollableEl.scrollTop <= 0;
        if ((scrollingDown && !atBottom) || (!scrollingDown && !atTop)) {
          return;
        }
      }

      e.preventDefault();
      wheelAccumRef.current += e.deltaY;

      if (wheelTimerRef.current) {
        window.clearTimeout(wheelTimerRef.current);
      }

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD && !isAnimatingRef.current) {
        if (wheelAccumRef.current > 0) {
          goNext();
        } else {
          goPrev();
        }
        wheelAccumRef.current = 0;
      }

      wheelTimerRef.current = window.setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 150);
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
    };
  }, [goNext, goPrev, isLocked]);

  // 键盘翻页
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked()) return;
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(total - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goTo, total, isLocked]);

  // 触摸翻页
  useEffect(() => {
    if (!isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isLocked()) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLocked()) return;
      if (touchStartYRef.current === null || touchStartXRef.current === null) return;
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
      const threshold = 50;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
        if (deltaY > 0) goNext();
        else goPrev();
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) goNext();
        else goPrev();
      }

      touchStartYRef.current = null;
      touchStartXRef.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, goNext, goPrev, isLocked]);

  const handleLeftClick = () => goPrev();
  const handleRightClick = () => goNext();

  const value = useMemo<FullpageContextValue>(
    () => ({ currentIndex, goTo, goNext, goPrev, total, registerLock, forceGoTo }),
    [currentIndex, goTo, goNext, goPrev, total, registerLock, forceGoTo],
  );

  return (
    <FullpageContext.Provider value={value}>
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{ touchAction: isMobile ? 'pan-y' : 'none' }}
      >
        {/* 背景层 */}
        {background && <div className="absolute inset-0 -z-10 pointer-events-none">{background}</div>}

        {/* 页面内容层 — 瞬间切换（被遮罩覆盖时切） */}
        <div className="absolute inset-0">
          <PageTransitionProvider direction={direction} entering={true} turnKey={turnKey}>
            {children(currentIndex)}
          </PageTransitionProvider>
        </div>

        {/* Clip-path 几何遮罩过渡 — 在页面之上，chrome (导航) 之下 */}
        <AnimatePresence initial={false} mode="wait">
          {maskActive && (
            <ClipMaskOverlay
              key={maskKey}
              shape={maskShape}
              color={maskColor}
              duration={MASK_HALF_DURATION}
            />
          )}
        </AnimatePresence>

        {/* 左右点击翻页区域
           注意：宽度限制为 w-16 (64px)，避免过宽覆盖到页面内容按钮导致点击被遮挡
           禁用态必须加 pointer-events-none，否则 disabled button 仍会拦截点击事件 */}
        <button
          type="button"
          onClick={handleLeftClick}
          aria-label="Previous page"
          className={cn(
            'absolute left-0 top-0 bottom-0 z-20 w-16 opacity-0 hover:opacity-100 transition-opacity bg-transparent',
            (currentIndex === 0 || isLocked()) ? 'pointer-events-none' : 'hover:bg-black/5 cursor-w-resize',
          )}
          disabled={currentIndex === 0 || isLocked()}
        />
        <button
          type="button"
          onClick={handleRightClick}
          aria-label="Next page"
          className={cn(
            'absolute right-0 top-0 bottom-0 z-20 w-16 opacity-0 hover:opacity-100 transition-opacity bg-transparent',
            (currentIndex === total - 1 || isLocked()) ? 'pointer-events-none' : 'hover:bg-black/5 cursor-e-resize',
          )}
          disabled={currentIndex === total - 1 || isLocked()}
        />

        {/* 页码显示 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-xs font-medium text-black/50 font-mono tracking-widest pointer-events-none select-none">
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* 固定浮层（导航栏、dots 等），在遮罩之上（z-40 > 遮罩 z-[80] 不行，调到 z-[100]） */}
        {chrome && (
          <div className="fixed inset-0 pointer-events-none z-[100]">{chrome}</div>
        )}
      </div>
    </FullpageContext.Provider>
  );
}
