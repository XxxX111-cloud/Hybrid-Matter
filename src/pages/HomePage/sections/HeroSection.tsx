import { useEffect, useRef, useState, useContext } from 'react';
import { useTypewriter } from '@/hooks/use-typewriter';
import FuzzyText from '@/components/fuzzy-text/FuzzyText';
import SpecularButton from '@/components/SpecularButton/SpecularButton';
import { FullpageContext } from '@/components/Fullpage/FullpageProvider';
import StaggerItem from '@/components/Fullpage/StaggerItem';

const EMAIL = '2685383417@qq.com';

const PILL_ITEMS = [
  { label: '查看作品', targetIndex: 2 },
  { label: '获奖经历', targetIndex: 3 },
  { label: '技能专长', targetIndex: 4 },
  { label: '联系我', targetIndex: 5 },
];

export default function HeroSection() {
  const fullpageCtx = useContext(FullpageContext);
  const goTo = fullpageCtx?.forceGoTo ?? fullpageCtx?.goTo ?? (() => {});

  const { displayed, done } = useTypewriter({
    text: '数字媒体艺术・交互 / 装置 / 三维视觉创作者\n大三｜上海视觉艺术学院\n以代码、三维空间、交互逻辑作为创作语言，搭建体验的规则，让观众成为作品的一部分。\n\nDigital Media Art Creator | Interaction · Installation · 3D Visual\nJunior Student, Shanghai Institute of Visual Arts\nUsing code, 3D space and interactive logic as creative languages. Build the rules of experience, and let audiences become part of the work.',
    speed: 38,
    startDelay: 600,
  });

  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setButtonsVisible(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = EMAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative z-1 flex h-screen w-full flex-col overflow-hidden px-5 sm:px-8 md:px-10"
      style={{
        justifyContent: 'flex-end',
        paddingBottom: '3rem',
      }}
    >
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="w-full max-w-4xl">
          <StaggerItem delay={0.05} offsetMultiplier={1.5} enterScale={1.02}>
            <div className="mb-4 sm:mb-5 flex flex-col items-start">
              <FuzzyText
                fontSize="clamp(28px, 5vw, 48px)"
                fontWeight={500}
                color="#000"
                baseIntensity={0.15}
                hoverIntensity={0.45}
                fuzzRange={18}
                fps={45}
                direction="horizontal"
                transitionDuration={12}
                clickEffect={true}
                letterSpacing={-1}
                className="my-0 mx-1"
              >
                Hey there, I'm 项诚皓,
              </FuzzyText>
              <FuzzyText
                fontSize="clamp(28px, 5vw, 48px)"
                fontWeight={500}
                color="#000"
                baseIntensity={0.15}
                hoverIntensity={0.45}
                fuzzRange={18}
                fps={45}
                direction="horizontal"
                transitionDuration={12}
                clickEffect={true}
                letterSpacing={-1}
                className="my-0 mx-1"
              >
                Digital Media Artist & Interactive Designer
              </FuzzyText>
            </div>
          </StaggerItem>

          <StaggerItem delay={0.18} offsetMultiplier={1}>
            <p
              className="text-black mb-5 sm:mb-6 text-lg text-left whitespace-pre-line"
              style={{
                lineHeight: 1.8,
                fontWeight: 400,
                minHeight: '200px',
                maxWidth: '60rem',
                padding: '0 12px',
              }}
            >
              {displayed}
              {!done && (
                <span
                  className="inline-block align-middle ml-[2px]"
                  style={{
                    width: '2px',
                    height: '1.1em',
                    backgroundColor: 'black',
                    animation: 'blink 1s step-end infinite',
                  }}
                />
              )}
            </p>
          </StaggerItem>

          <StaggerItem
            delay={0.32}
            offsetMultiplier={0.8}
            className="flex flex-wrap"
            style={{
              rowGap: '0.25rem',
              opacity: buttonsVisible ? 1 : 0,
              transform: buttonsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILL_ITEMS.map((item) => (
              <SpecularButton
                key={item.label}
                onClick={() => goTo(item.targetIndex)}
                size="md"
                radius={999}
                tint="#ffffff"
                tintOpacity={0.85}
                textColor="#000000"
                lineColor="#000000"
                baseColor="#000000"
                intensity={0.8}
                shineSize={12}
                shineFade={50}
                thickness={1.2}
                followMouse
                proximity={300}
                className="hero-specular-btn"
              >
                {item.label}
              </SpecularButton>
            ))}

            <SpecularButton
              size="md"
              radius={999}
              tint="transparent"
              tintOpacity={0}
              textColor="#000000"
              lineColor="#000000"
              baseColor="#000000"
              intensity={1}
              shineSize={15}
              shineFade={60}
              thickness={1}
              followMouse
              proximity={300}
              onClick={handleCopyEmail}
              className="hero-specular-btn hero-specular-btn--email"
              aria-label="Copy email address"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>
                  Reach us:{' '}
                  <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>
                    {copied ? 'Copied!' : EMAIL}
                  </span>
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="1" y="0" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                  <rect x="3" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              </span>
            </SpecularButton>
          </StaggerItem>
        </div>
      </div>

      <style>{`
        .hero-specular-btn {
          font-size: clamp(13px, 1.6vw, 15px) !important;
          padding-left: clamp(16px, 2vw, 20px) !important;
          padding-right: clamp(16px, 2vw, 20px) !important;
          padding-top: 0.5em !important;
          padding-bottom: 0.5em !important;
          margin: 0 0.2em 0.4em 0.2em;
          white-space: nowrap;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: none !important;
        }
        .hero-specular-btn--email {
          border: 1px solid #000;
        }
        @media (min-width: 1024px) {
          #hero {
            justify-content: center !important;
            padding-bottom: 0 !important;
          }
        }
        @media (max-width: 1023px) {
          #hero {
            justify-content: flex-start !important;
            padding-top: 5rem !important;
            padding-bottom: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
