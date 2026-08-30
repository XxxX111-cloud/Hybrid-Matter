import { MOCK_SKILLS, type ISkillCategory } from '@/data/portfolio';
import StaggerItem from '@/components/Fullpage/StaggerItem';
import SplitTextTitle from '@/components/Fullpage/SplitTextTitle';

export default function SkillsSection() {
  return (
    <section id="skills" className="w-full h-screen overflow-hidden bg-white">
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-16 md:py-20">
          <StaggerItem delay={0.05} offsetMultiplier={0.8}>
            <span className="text-[13px] uppercase tracking-[0.2em] text-black/50">
              04 — Skills
            </span>
          </StaggerItem>
          <div className="mt-4">
            <SplitTextTitle
              as="h2"
              staggerMs={35}
              offsetPx={40}
              enterScale={1.06}
              className="text-black font-normal"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 6vw, 64px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Tools of the trade.
            </SplitTextTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8 mt-8">
            {MOCK_SKILLS.map((category: ISkillCategory, idx: number) => (
              <StaggerItem
                key={category.id}
                delay={0.2 + idx * 0.06}
                offsetMultiplier={0.8}
                enterScale={1.02}
              >
                <div className="group border border-black/10 rounded-2xl p-6 md:p-7 bg-white hover:border-black/20 hover:shadow-sm transition-all">
                  <h3
                    className="text-black font-medium mb-4 md:mb-5"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                    }}
                  >
                    {category.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/[0.04] text-black text-sm border border-black/5"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
