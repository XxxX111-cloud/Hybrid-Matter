import { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import { UniversalLink } from '@lark-apaas/client-toolkit-lite';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';

const EMAIL = '2685383417@qq.com';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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
    <section id="contact" className="w-full h-screen overflow-hidden bg-white">
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-16 md:py-20 flex flex-col h-full">
          <StaggerItem delay={0.05} offsetMultiplier={0.8} className="text-center mb-4">
            <span className="text-[13px] uppercase tracking-[0.2em] text-black/50">
              05 — Contact
            </span>
          </StaggerItem>
          <div className="text-center">
            <SplitTextTitle
              as="h2"
              staggerMs={30}
              offsetPx={40}
              enterScale={1.06}
              className="text-black font-normal"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 7vw, 80px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Let&apos;s Connect.
            </SplitTextTitle>
          </div>
          <StaggerItem delay={0.25} offsetMultiplier={0.8} className="text-center mt-6 mb-10">
            <p className="text-black/60 text-base md:text-lg max-w-xl mx-auto">
              欢迎交流合作，不管是项目邀约、技术探讨还是单纯的创意碰撞都很好。
            </p>
          </StaggerItem>

          <StaggerItem
            delay={0.35}
            offsetMultiplier={0.7}
            enterScale={1.02}
            className="max-w-2xl mx-auto w-full flex-1 flex items-start"
          >
            <div className="w-full border border-black/10 rounded-3xl p-8 md:p-12 bg-white backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="size-14 rounded-full bg-black text-white flex items-center justify-center">
                  <Mail className="size-6" />
                </div>
                <div>
                  <p className="text-black/50 text-sm mb-1">Email</p>
                  <UniversalLink
                    to={`mailto:${EMAIL}`}
                    className="text-black hover:opacity-60 transition-opacity"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(20px, 3vw, 28px)',
                    }}
                  >
                    {EMAIL}
                  </UniversalLink>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-sm hover:bg-black/80 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      复制邮箱
                    </>
                  )}
                </button>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem
            delay={0.5}
            offsetMultiplier={0.6}
            className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-black"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                }}
              >
                Xiang Chenghao
              </span>
              <span className="text-black select-none" style={{ fontSize: '18px' }}>
                &#10032;&#xfe0e;
              </span>
            </div>
            <p className="text-black/40 text-sm">
              &copy; {new Date().getFullYear()} 项诚皓. All rights reserved.
            </p>
          </StaggerItem>
        </div>
      </div>
    </section>
  );
}
