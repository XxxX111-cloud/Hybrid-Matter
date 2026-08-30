import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { MOCK_WORKS, type IWork } from '@/data/portfolio';
import Image from '@/components/ui/image';
import TextType from '@/components/TextType/TextType';
import { useWorksDialog } from '@/components/WorksDialog/WorksDialogContext';
import { FullpageContext } from '@/components/Fullpage/FullpageProvider';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';
import { useNavigate } from 'react-router-dom';

const FLIP_DELAY_MS = 1000;

// 4:3 卡片周长各边占比（用于环形进度按比例分配时间）
const EDGE_RATIOS = {
  top: 4 / 14,
  right: 3 / 14,
  bottom: 4 / 14,
  left: 3 / 14,
};

function getEdgeProgress(p: number) {
  const topEnd = EDGE_RATIOS.top;
  const rightEnd = topEnd + EDGE_RATIOS.right;
  const bottomEnd = rightEnd + EDGE_RATIOS.bottom;
  return {
    top: Math.min(Math.max(p / EDGE_RATIOS.top, 0), 1),
    right: p <= topEnd ? 0 : Math.min(Math.max((p - topEnd) / EDGE_RATIOS.right, 0), 1),
    bottom: p <= rightEnd ? 0 : Math.min(Math.max((p - rightEnd) / EDGE_RATIOS.bottom, 0), 1),
    left: p <= bottomEnd ? 0 : Math.min(Math.max((p - bottomEnd) / EDGE_RATIOS.left, 0), 1),
  };
}

interface WorkFlipCardProps {
  work: IWork;
  index: number;
  onClick?: () => void;
  clickable?: boolean;
  coverMode?: 'cover' | 'contain';
  coverBg?: string;
}

function WorkFlipCard({ work, index, onClick, clickable = false, coverMode = 'cover', coverBg = '#000' }: WorkFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startFlipCountdown = useCallback(() => {
    clearTimer();
    startRef.current = performance.now();
    setProgress(0);
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(elapsed / FLIP_DELAY_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFlipped(true);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [clearTimer]);

  const handleMouseEnter = () => {
    startFlipCountdown();
  };

  const handleMouseLeave = () => {
    clearTimer();
    setFlipped(false);
    setProgress(0);
  };

  const edge = getEdgeProgress(progress);
  const borderColor = 'rgba(255, 255, 255, 0.6)';

  return (
    <div
      className="relative w-full aspect-[4/3] cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {/* 正面 */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        initial={false}
        animate={{ rotateY: flipped ? -180 : 0, opacity: flipped ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <Image
          src={work.imageUrl}
          alt={work.title}
          className={coverMode === 'contain'
            ? 'w-full h-full object-contain transition-transform duration-700 group-hover:scale-105'
            : 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'}
          style={coverMode === 'contain' ? { backgroundColor: coverBg } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            <span className="text-white/70 text-[11px] uppercase tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-white font-medium text-lg mt-1">{work.title}</h3>
          </div>
          <span className="text-white/70 text-[11px] uppercase tracking-wider shrink-0">
            {work.category}
          </span>
        </div>

        {/* 绕圈进度条 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 75"
          preserveAspectRatio="none"
        >
          {/* top */}
          <line x1="0" y1="0" x2="100" y2="0" stroke={borderColor} strokeWidth="0.5" strokeDasharray={100} strokeDashoffset={100 - edge.top * 100} />
          {/* right */}
          <line x1="100" y1="0" x2="100" y2="75" stroke={borderColor} strokeWidth="0.5" strokeDasharray={75} strokeDashoffset={75 - edge.right * 75} />
          {/* bottom */}
          <line x1="100" y1="75" x2="0" y2="75" stroke={borderColor} strokeWidth="0.5" strokeDasharray={100} strokeDashoffset={100 - edge.bottom * 100} />
          {/* left */}
          <line x1="0" y1="75" x2="0" y2="0" stroke={borderColor} strokeWidth="0.5" strokeDasharray={75} strokeDashoffset={75 - edge.left * 75} />
        </svg>
      </motion.div>

      {/* 背面 */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-black/90 p-6 flex flex-col"
        initial={false}
        animate={{ rotateY: flipped ? 0 : 180, opacity: flipped ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-white/50 text-xs uppercase tracking-wider">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className="text-white font-medium"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
            }}
          >
            {work.title}
          </h3>
        </div>
        <p className="text-white/60 text-xs uppercase tracking-wider mb-4">
          {work.category}
        </p>
        <p className="text-white/80 text-sm leading-relaxed mb-6">
          {work.description}
        </p>
        <div className="mt-auto flex items-center gap-2 text-white/50 text-xs">
          <span>Hover back to preview</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="rotate-180">
            <path
              d="M3 6h6m0 0L6 3m3 3L6 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export default function WorksSection() {
  const navigate = useNavigate();
  const { openDialog } = useWorksDialog();

  const handleWorkClick = useCallback(
    (work: IWork) => {
       if (work.id === 'photography-series') {
         navigate('/photography');
       } else if (work.id === 'prepped-food-spring') {
         openDialog('prepped-food-spring');
       } else if (work.id === 'dt-business-video') {
         openDialog('dt-business-video');
       } else if (work.id === 'throat-civilization') {
         openDialog('throat-civilization');
        } else if (work.id === 'gfl-ar-dimension') {
          openDialog('gfl-ar-dimension');
        } else if (work.id === 'yitao') {
          openDialog('yi-tao');
        }
    },
    [navigate, openDialog],
  );

  return (
    <section id="works" className="w-full h-screen overflow-hidden bg-white">
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-16 md:py-20">
          <StaggerItem delay={0.05} offsetMultiplier={0.8}>
            <span className="text-[13px] uppercase tracking-[0.2em] text-black/50">
              02 — Selected Works
            </span>
          </StaggerItem>
          <div
            className="mt-4"
            style={{
              width: '100%',
              minHeight: 'clamp(70px, 10vw, 130px)',
            }}
          >
            <StaggerItem delay={0.15} offsetMultiplier={1.2} enterScale={1.03}>
              <TextType
                text={["Things I've made.", "Works I'm proud of.", "Crafted with care."]}
                as="h2"
                typingSpeed={80}
                pauseDuration={2500}
                deletingSpeed={40}
                loop={true}
                startOnVisible={false}
                showCursor={true}
                cursorCharacter="_"
                variableSpeed={{ min: 60, max: 110 }}
                className="works-type-title"
              />
            </StaggerItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-8 mt-6">
            {MOCK_WORKS.map((work: IWork, idx: number) => {
              const isDt = work.id === 'dt-business-video';
              return (
                <StaggerItem
                  key={work.id}
                  delay={0.25 + idx * 0.07}
                  offsetMultiplier={0.9}
                  enterScale={1.02}
                >
                  <WorkFlipCard
                    work={work}
                    index={idx}
                     clickable={work.id === 'photography-series' || work.id === 'prepped-food-spring' || work.id === 'dt-business-video' || work.id === 'throat-civilization' || work.id === 'gfl-ar-dimension' || work.id === 'yitao'}
                    onClick={() => handleWorkClick(work)}
                    coverMode={isDt ? 'contain' : 'cover'}
                    coverBg="#000000"
                  />
                </StaggerItem>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .works-type-title {
          font-family: var(--font-heading);
          font-size: clamp(48px, 8vw, 100px);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #000;
        }
        .works-type-title .text-type__cursor {
          font-weight: 300;
          color: #000;
        }
      `}</style>
    </section>
  );
}
