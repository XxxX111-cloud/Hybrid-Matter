import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useWorksDialog } from './WorksDialogContext';
import Image from '@/components/ui/image';

const VIDEO_URL = resolveAppUrl('/assets/Q8SccXlcpH.mp4');

// ================== 图片分配（28张全部使用，无重复） ==================
// 设计图/场景类（2张）
const IMG_EXHIBITION = resolveAppUrl('/assets/SmfS22Fayl.png');       // 1. 展览现场正面
const IMG_KIVICUBE = resolveAppUrl('/assets/UBQH2UOSl9.png');           // 2. Kivicube设计图（技术调研区用）
const IMG_CARD_SIZE = resolveAppUrl('/assets/AcQUpYhPMv.png');          // 3. 卡牌尺寸设计图

// 调研配图（3张）
const IMG_POKEMON_CARDS = resolveAppUrl('/assets/430A49yOMv.png');      // 宝可梦卡牌实物参考
const IMG_YUGIOH_CARDS = resolveAppUrl('/assets/WWZHA3Q4Du.png');       // 游戏王卡牌实物参考
const IMG_KIVICUBE_LOGO = resolveAppUrl('/assets/pup8Wwe6hQ.png');      // Kivicube logo

// 技术实现截图（3张）
const IMG_UNITY_SCENE = resolveAppUrl('/assets/iUWFgqo6vi.png');        // Unity AR场景搭建
const IMG_BLENDER_OBS_1 = resolveAppUrl('/assets/UUkrLxiFFP.jpg');      // Blender建模+OBS录屏 1
const IMG_BLENDER_OBS_2 = resolveAppUrl('/assets/ZFLVs7Ihfi.jpg');      // Blender建模+OBS录屏 2

// 成果展示配图（6张）
const IMG_EXHIBITION_SIDE = resolveAppUrl('/assets/I9mDJHjxA5.jpg');      // 展览现场侧面
const IMG_POSTER = resolveAppUrl('/assets/IjtWDYSJVB.jpg');               // 宣传海报主视觉
const IMG_WALLET = resolveAppUrl('/assets/tMBvWhAKbN.jpg');               // 卡牌收纳钱包
const IMG_DELUXE_BOX = resolveAppUrl('/assets/M1cwVheMud.png');           // 豪华礼盒套装
const IMG_BLIND_BOX = resolveAppUrl('/assets/TpUSegOLxh.png');            // 盲盒包装盒

// 角色立绘（13张）—— 7张给最终IP + 6张给废稿
const IP_CHARS = [
  {
    name: '石犁小将',
    attr: '石 · 农耕属性',
    desc: '原型江南石犁，头部打磨光滑的石犁刃造型，身体敦实健壮，体表有岩石肌理，头顶点缀稻穗绒毛，勤恳又可靠，农耕文明化身',
    skill: '裂地耕涛',
    src: resolveAppUrl('/assets/82NhJcMXTs.png'),
  },
  {
    name: '骨针小刺',
    attr: '骨 · 敏捷属性',
    desc: '原型出土骨针+骨针广场地标，身形纤细，头顶一根细长骨针状尖角，身体是米白色骨质质感，手脚灵活，心灵手巧，擅长用灵力编织结界',
    skill: '织骨结界',
    src: resolveAppUrl('/assets/uKW48qVSOm.png'),
  },
  {
    name: '石凿小尖',
    attr: '岩 · 格斗属性',
    desc: '原型打磨石器石凿石斧，头部是石凿刃口造型，身体小巧精干，四肢灵活，体表是天然岩石纹理，精准打击，行动力敏捷',
    skill: '凿破千钧',
    src: resolveAppUrl('/assets/jdbMkTUaPo.png'),
  },
  {
    name: '锋矢猎手',
    attr: '岩 · 格斗属性',
    desc: '原型广富林石镞（石箭镞），头部尖锐的三棱形箭头造型，红色锐利的眼睛，粗壮有力的肢体，全身遍布石刺棱角，"龙山文化"阵营的狩猎守护灵',
    skill: '穿古破阵',
    src: resolveAppUrl('/assets/hQ7kVJke3u.png'),
  },
  {
    name: '鼎纹力士',
    attr: '骨 · 格斗属性',
    desc: '原型广富林文化夹砂陶鼎，身躯由夹砂陶土煅烧而成，每一道纹饰都复刻陶器上的绳纹与几何印纹，厚重身躯能抵御风雨，"融合与力量"的代表',
    skill: '炊火护御',
    src: resolveAppUrl('/assets/QoZuQBfh5B.png'),
  },
  {
    name: '鬶足行者',
    attr: '陶 · 岩属性',
    desc: '原型袋足陶鬶，头顶尖翘造型复刻陶鬶标志性的流口，身体上的浅纹是陶器上绳纹的简化，龙山文化南迁的见证者',
    skill: '薪火流温',
    src: resolveAppUrl('/assets/po8ZZXZCWp.png'),
  },
  {
    name: '环玉游者',
    attr: '玉 · 飞行属性',
    desc: '原型良渚文化玉璧/玉环，身体由温润的白玉凝炼而成，背后的环状玉饰复刻良渚玉璧形制，承载先民"沟通天地、祈求安宁"的信仰',
    skill: '天环祈福',
    src: resolveAppUrl('/assets/6PrJLv9tF6.png'),
  },
];

const DRAFT_CHARS = [
  { name: '神面玉影', attr: '玉 + 灵', desc: '原型良渚神人兽面纹，轮廓圆润卡通化，周身环绕多层玉环', src: resolveAppUrl('/assets/Y3OJjIAudt.png') },
  { name: '夹砂鼎仔', attr: '陶 + 岩', desc: '原型夹砂陶鼎，三足短胖鼎形精灵，鼎耳变成两只小尖角', src: resolveAppUrl('/assets/85oolzyicD.png') },
  { name: '牌坊镇灵', attr: '岩 + 灵', desc: '原型集贤园古建石牌坊，方正的石质灵体，头顶复刻牌坊檐角', src: resolveAppUrl('/assets/uCR0ln4wT6.png') },
  { name: '芦絮飘飘', attr: '风 + 草', desc: '原型湖边芦苇，蓬松的芦絮团身体，底下伸出细短根茎小脚', src: resolveAppUrl('/assets/i6IUiZaVpk.png') },
  { name: '古土芽芽', attr: '土 + 草', desc: '原型遗址土层原生草木，圆滚滚的土团子，头顶长出嫩绿新芽', src: resolveAppUrl('/assets/Xj6gKnM28I.png') },
  { name: '渡陶水影', attr: '水 属性', desc: '原型印纹陶罐+富林湖，陶罐身形，下半部分融合流水形态', src: resolveAppUrl('/assets/UsUuZvdzeG.png') },
];

// ================== 辅助组件 ==================

function SectionLabel({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'emerald' | 'amber' | 'rose' | 'violet' }) {
  const toneMap: Record<string, string> = {
    default: 'bg-white/10 text-white/70 border-white/10',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  };
  return (
    <div
      className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.18em] uppercase border ${toneMap[tone]}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-white font-semibold"
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(20px, 2.4vw, 26px)',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h3>
  );
}

// 阶段时间线节点
function PhaseHeader({ num, title, subtitle, tone }: { num: string; title: string; subtitle: string; tone: string }) {
  const accentMap: Record<string, string> = {
    '1': 'text-cyan-400',
    '2': 'text-violet-400',
    '3': 'text-amber-400',
    '4': 'text-emerald-400',
    '5': 'text-rose-400',
  };
  const lineMap: Record<string, string> = {
    '1': 'from-cyan-500/40',
    '2': 'from-violet-500/40',
    '3': 'from-amber-500/40',
    '4': 'from-emerald-500/40',
    '5': 'from-rose-500/40',
  };
  return (
    <div className="flex items-start gap-5 mb-6">
      <div className="shrink-0 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border bg-white/[0.04] ${accentMap[tone]} border-white/10`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {num}
        </div>
        <div className={`w-px flex-1 bg-gradient-to-b ${lineMap[tone]} to-transparent mt-3`} />
      </div>
      <div className="pt-1 flex-1">
        <div className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1.5">{subtitle}</div>
        <SectionTitle>{title}</SectionTitle>
      </div>
    </div>
  );
}

// 数据卡
function StatCard({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.03]">
      <div
        className={`font-bold text-2xl sm:text-3xl ${accent ?? 'text-white'}`}
        style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
      >
        {value}
      </div>
      <div className="text-white/50 text-xs mt-1.5">{label}</div>
    </div>
  );
}

// 带图卡片（左图右文或上图下文）
function ImageTextCard({
  src,
  caption,
  alt,
  bgWhite,
  orientation = 'horizontal',
}: {
  src: string;
  caption?: string;
  alt?: string;
  bgWhite?: boolean;
  orientation?: 'horizontal' | 'vertical';
}) {
  if (orientation === 'vertical') {
    return (
      <figure
        className={`rounded-xl overflow-hidden border ${
          bgWhite ? 'bg-white border-black/10' : 'bg-white/[0.03] border-white/10'
        }`}
      >
        <div className={`aspect-[4/3] flex items-center justify-center ${bgWhite ? '' : 'bg-black/30'}`}>
          <Image src={src} alt={alt ?? ''} loading="lazy" className="h-full w-full object-contain" />
        </div>
        {caption && (
          <figcaption
            className={`px-3 py-2.5 text-xs ${bgWhite ? 'text-black/70' : 'text-white/60'}`}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return (
    <figure
      className={`flex items-stretch gap-4 rounded-xl overflow-hidden border p-4 ${
        bgWhite ? 'bg-white border-black/10' : 'bg-white/[0.03] border-white/10'
      }`}
    >
      <div className={`shrink-0 w-[140px] sm:w-[180px] rounded-lg overflow-hidden flex items-center justify-center ${bgWhite ? '' : 'bg-black/30'}`}>
        <Image src={src} alt={alt ?? ''} loading="lazy" className="w-full h-full object-contain" />
      </div>
      {caption && (
        <figcaption className={`flex-1 text-sm ${bgWhite ? 'text-black/75' : 'text-white/70'}`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 最终IP角色横向滚动条
function IPCharacterStrip() {
  return (
    <div className="w-full -mx-6 px-6 sm:-mx-8 sm:px-8 overflow-x-auto">
      <style>{`
        .gfl-ip-strip::-webkit-scrollbar { height: 6px; }
        .gfl-ip-strip::-webkit-scrollbar-track { background: transparent; }
        .gfl-ip-strip::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.18); border-radius: 999px; }
      `}</style>
      <div className="gfl-ip-strip flex gap-4 pb-3 min-w-0">
        {IP_CHARS.map((ch, idx) => (
          <motion.figure
            key={ch.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="shrink-0 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] w-[200px] sm:w-[240px]"
          >
            <div className="aspect-square flex items-center justify-center bg-black/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120_119_198_0.15),transparent_60%)]" />
              <Image
                src={ch.src}
                alt={ch.name}
                loading="lazy"
                className="relative z-10 h-[170px] sm:h-[200px] w-auto object-contain transition-transform duration-500 hover:scale-[1.06]"
              />
            </div>
            <figcaption className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-white font-semibold text-base">{ch.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">0{idx + 1}</div>
              </div>
              <div className="text-emerald-300/80 text-[11px] mb-2.5">{ch.attr}</div>
              <p className="text-white/50 text-[11.5px] leading-relaxed line-clamp-3">{ch.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                技能 · {ch.skill}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

// 废稿IP角色横向滚动条（灰度 + 低透明）
function DraftCharacterStrip() {
  return (
    <div className="w-full -mx-6 px-6 sm:-mx-8 sm:px-8 overflow-x-auto">
      <div className="flex gap-3 pb-2 min-w-0">
        {DRAFT_CHARS.map((ch, idx) => (
          <figure
            key={ch.name}
            className="shrink-0 relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] w-[150px] sm:w-[170px] opacity-50 grayscale"
          >
            <div className="aspect-square flex items-center justify-center bg-black/30">
              <Image src={ch.src} alt={ch.name} loading="lazy" className="h-[120px] sm:h-[140px] w-auto object-contain" />
            </div>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white/50 uppercase tracking-wider">
              v1.0
            </div>
            <figcaption className="p-2.5">
              <div className="text-white/80 text-sm font-medium">{ch.name}</div>
              <div className="text-white/40 text-[10px] mt-0.5">{ch.attr}</div>
              <p className="text-white/30 text-[10px] leading-relaxed line-clamp-2 mt-1.5">{ch.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// 成因卡片（六问题）
function CauseCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center">
          {num}
        </span>
        <span className="text-white text-sm font-medium">{title}</span>
      </div>
      <p className="text-white/50 text-xs leading-relaxed pl-9">{desc}</p>
    </div>
  );
}

// 竞品对比行
function CompetitorRow({ name, audience, price, feature }: { name: string; audience: string; price: string; feature: string }) {
  return (
    <div className="grid grid-cols-12 gap-3 py-3 border-b border-white/5 last:border-0 items-start">
      <div className="col-span-3 text-white text-sm font-medium">{name}</div>
      <div className="col-span-4 text-white/60 text-xs">{audience}</div>
      <div className="col-span-2 text-white/60 text-xs tabular-nums">{price}</div>
      <div className="col-span-3 text-white/60 text-xs">{feature}</div>
    </div>
  );
}

// 成果展示图片网格
function ShowcaseGrid() {
  const items = [
    { src: IMG_EXHIBITION, caption: '布展效果图 · 展览现场正面', bgWhite: false },
    { src: IMG_EXHIBITION_SIDE, caption: '布展效果图 · 展览现场侧面', bgWhite: false },
    { src: IMG_POSTER, caption: '宣传海报 · GFL-AR 次元纪主视觉', bgWhite: false },
    { src: IMG_WALLET, caption: '后续周边包装 · 卡牌收纳钱包', bgWhite: false },
    { src: IMG_DELUXE_BOX, caption: '后续周边包装 · 豪华礼盒套装', bgWhite: false },
    { src: IMG_BLIND_BOX, caption: '后续周边包装 · 盲盒包装盒', bgWhite: false },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <motion.figure
          key={item.caption}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className={`group relative overflow-hidden rounded-xl border ${
            item.bgWhite ? 'bg-white border-black/10' : 'bg-white/[0.03] border-white/10'
          }`}
        >
          <div className={`aspect-[4/3] flex items-center justify-center ${item.bgWhite ? '' : 'bg-black/30'}`}>
            <Image src={item.src} alt={item.caption} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
          <figcaption className={`px-3 py-2 text-[11px] ${item.bgWhite ? 'text-black/70' : 'text-white/60'}`}>
            {item.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

// ================== 主组件 ==================

export default function GflArDimensionDialog() {
  const { openWork, closeDialog } = useWorksDialog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOpen = openWork === 'gfl-ar-dimension';

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

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
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          onClick={closeDialog}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl my-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(30, 27, 75, 0.35) 0%, rgba(10, 10, 15, 0.98) 55%, #000 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={closeDialog}
              className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 flex items-center justify-center backdrop-blur-sm border border-white/10"
              aria-label="关闭"
            >
              <X className="size-5" />
            </button>

            {/* 顶部 Header */}
            <div className="relative px-6 sm:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(120_119_198_0.18),transparent_70%)] pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="text-white/40 text-[11px] uppercase tracking-[0.28em] mb-4">
                  AR Interactive Design · Guangfulin · 2025
                </div>
                <h2
                  className="text-white font-bold mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 4.5vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  GFL-AR次元纪
                </h2>
                <p className="text-white/50 text-base sm:text-lg mb-6 max-w-2xl leading-relaxed">
                  广富林文明主题多卡牌组合 AR 交互设计 — 以良渚玉璧、龙山陶器文物为原型打造 3D
                  精灵系列 IP，人物·场景·动作 三类亚克力实体卡牌多卡同步识别，拼接连贯文明动画。
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    项诚皓 · 项目负责人
                  </span>
                  <span>李茗宇 · Unity AR 程序</span>
                  <span>朱奕恒 · 视觉卡牌设计</span>
                  <span>秦文渊 · 动画/宣传片</span>
                </div>
              </div>
            </div>

            {/* 主体内容 */}
            <div className="px-6 sm:px-10 pb-10 space-y-14 max-h-[78vh] overflow-y-auto">
              {/* 项目负责人突出卡片 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative p-6 sm:p-7 rounded-2xl border border-white/15 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(120, 119, 198, 0.12) 0%, rgba(255,255,255,0.02) 60%)',
                }}
              >
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold tracking-[0.15em] uppercase border border-emerald-500/25">
                  Lead Designer
                </div>
                <div className="flex items-baseline gap-3 mb-5">
                  <span
                    className="text-white font-bold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(22px, 2.5vw, 30px)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    项诚皓
                  </span>
                  <span className="text-white/40 text-sm">Xiang Chenghao</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { t: '项目前期构想', d: '与李茗宇共同构思项目方向，确定广富林文明主题多卡牌组合AR交互设计的核心概念' },
                    { t: '项目 PPT 制作', d: '独立完成项目汇报 PPT 的内容策划、视觉设计、排版布局与数据可视化' },
                    { t: 'IP建模与动画', d: '负责第二版 2.0 七大 IP 角色的 3D 建模，以及动画场景和动作设计制作' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-white/90 text-sm font-semibold mb-1.5">0{i + 1} · {item.t}</div>
                      <p className="text-white/50 text-xs leading-relaxed">{item.d}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ========== 第一阶段：项目初期调研 ========== */}
              <section>
                <PhaseHeader num="01" title="项目初期调研" subtitle="Phase 1 · Preliminary Research" tone="1" />
                <div className="pl-[68px] space-y-6">
                  {/* 1.1 调研背景与核心数据 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      <h4 className="text-white text-sm font-semibold">调研背景与核心数据</h4>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      调研主题：广富林"高知名度 ≠ 高付费"成因分析 — 广富林不愁"流量"，但游客付费意愿极低，"拍完照就走"是大多数人的行为模式，核心文化价值没有转化为实际体验价值与消费价值。
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <StatCard value="300万" label="年游客总量（人次）" accent="text-cyan-300" />
                      <StatCard value="60万" label="付费游客（人次）" />
                      <StatCard value="20%" label="付费转化率" accent="text-amber-300" />
                      <StatCard value="80%" label="免费流失率" accent="text-rose-300" />
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-white/50">
                      <span>四馆联票 · <span className="text-white/80">80 元</span></span>
                      <span>水下博物馆单馆 · <span className="text-white/80">30 元</span></span>
                      <span>约 240 万游客"进园但不付费"</span>
                    </div>
                  </div>

                  {/* 1.2 六大成因 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-rose-400" />
                      <h4 className="text-white text-sm font-semibold">成因分析 · 六大问题</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CauseCard num="01" title="文化叙事浅层" desc="遗址文化展示薄弱，游客难以感知核心文化价值，体验无深度" />
                      <CauseCard num="02" title="展陈体验陈旧" desc="展陈科技融合度低、缺少沉浸式互动，游客参与感差" />
                      <CauseCard num="03" title="IP 更新乏力" desc="过度依赖建筑景观流量，无迭代 IP 和特色消费场景" />
                      <CauseCard num="04" title="区位配套受限" desc="地理位置偏远、交通耗时久，制约游客到访频率" />
                      <CauseCard num="05" title="免费模式反噬" desc="公共区域免费形成「公园打卡」认知，展馆性价比低" />
                      <CauseCard num="06" title="客群结构老化" desc="核心客群偏传统观光，年轻付费客群占比不足" />
                    </div>
                  </div>

                  {/* 1.3 调研结论 */}
                  <div className="p-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06]">
                    <div className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                      Research Insight
                    </div>
                    <p className="text-white/85 text-sm leading-relaxed">
                      这恰恰是 VR/AR 的用武之地 — 用数字手段将"看不懂的遗址"变为"可沉浸的故事"，
                      将"一次性打卡"变为"愿意为之付费的深度体验"，填补那 80% 免费游客的付费意愿缺口。
                    </p>
                  </div>
                </div>
              </section>

              {/* ========== 第二阶段：市场调研与技术调研 ========== */}
              <section>
                <PhaseHeader num="02" title="市场调研与技术调研" subtitle="Phase 2 · Market & Tech Research" tone="2" />
                <div className="pl-[68px] space-y-8">
                  {/* 2.1 广富林文化资源 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-400" />
                      <h4 className="text-white text-sm font-semibold">广富林文化资源</h4>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      广富林文化遗址被誉为"上海之根"，是上海最早发现大型史前遗址的地方。融合良渚文化、龙山文化等多元特征以及先民"海纳百川"的精神。
                    </p>
                    <ul className="text-white/60 text-sm space-y-1.5 pl-4">
                      <li className="list-disc marker:text-white/30">考古展示馆、水下博物馆、古陶艺术馆等实体场馆，可作为卡牌收集的"任务点"</li>
                      <li className="list-disc marker:text-white/30">造型奇特的陶器、充满力量的骨针、纹饰繁复的青铜器，都可以"变身"为卡牌</li>
                    </ul>
                  </div>

                  {/* 2.2 集换式卡牌市场 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-400" />
                      <h4 className="text-white text-sm font-semibold">集换式卡牌市场分析</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <StatCard value="263亿" label="2024国内市场（元）" accent="text-violet-300" />
                      <StatCard value="350亿+" label="2026预计突破" accent="text-violet-300" />
                      <StatCard value="56.6%" label="年复合增长率" accent="text-emerald-300" />
                      <StatCard value="$84亿" label="2025全球市场" />
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      高增长朝阳赛道 · 全球头部 IP（宝可梦/万代/孩之宝）合计占据 55% 市场份额 · 国内 TCG 平台交易额同比上涨 47%
                    </p>
                  </div>

                  {/* 2.3 竞品分析 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-400" />
                      <h4 className="text-white text-sm font-semibold">竞品分析</h4>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="grid grid-cols-12 gap-3 pb-2 border-b border-white/10 text-[11px] text-white/40 uppercase tracking-wider">
                        <div className="col-span-3">产品</div>
                        <div className="col-span-4">核心客群</div>
                        <div className="col-span-2">价格</div>
                        <div className="col-span-3">特点</div>
                      </div>
                      <CompetitorRow name="宝可梦卡牌" audience="全龄段·亲子家庭·年轻白领" price="10-30元" feature="轻量化·颜值高·社交强" />
                      <CompetitorRow name="游戏王卡牌" audience="16-30岁男性核心玩家" price="20-50元" feature="策略性强·圈层粘性高" />
                      <CompetitorRow name="球星卡" audience="体育爱好者·高端收藏家" price="50-100元" feature="稀缺性驱动·编号限定" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                      <figure className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                        <div className="aspect-[4/3] flex items-center justify-center bg-black/30">
                          <Image
                            src={IMG_YUGIOH_CARDS}
                            alt="游戏王卡牌实物参考"
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <figcaption className="px-3 py-2.5 text-xs text-white/60">
                          游戏王卡牌实物参考 — 策略性强，圈层粘性高
                        </figcaption>
                      </figure>
                      <figure className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                        <div className="aspect-[4/3] flex items-center justify-center bg-black/30">
                          <Image
                            src={IMG_POKEMON_CARDS}
                            alt="宝可梦卡牌实物参考"
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <figcaption className="px-3 py-2.5 text-xs text-white/60">
                          宝可梦卡牌实物参考 — 全球头部IP TCG，全龄段覆盖
                        </figcaption>
                      </figure>
                    </div>
                  </div>

                  {/* 2.4 技术调研 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-400" />
                      <h4 className="text-white text-sm font-semibold">技术调研 · Kivicube 局限性</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="text-white text-sm font-medium mb-1.5">单识别图限制</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          单场景只能绑定 1 张识别图，想要识别多张卡牌必须使用「合辑」功能，无法同时捕捉画面内平铺的多组卡牌。
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="text-white text-sm font-medium mb-1.5">无并行跟踪</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          合辑没有"多目标并行跟踪"能力，摄像头画面里同时出现多类卡牌时，引擎只会随机锁定其中一张。
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] sm:col-span-2">
                        <div className="text-white text-sm font-medium mb-1.5">动画支持有限</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          可视化交互仅支持基础触发条件（识别到图 / 点击模型 / 动画播放完成），不支持多识别目标的逻辑与/或判定；
                          仅支持基础内置位移动画、缩放、旋转 Tween，导入外部 FBX 骨骼动画后无法做参数化动态切换。
                        </p>
                      </div>
                    </div>
                    <ImageTextCard
                      src={IMG_KIVICUBE}
                      caption="Kivicube 平台 AR 作品参考 — 因以上局限性，最终选择 Unity VUFORIA 作为 AR 识别引擎，实现多卡牌同步识别与动画拼装。"
                      bgWhite
                    />
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        <Image
                          src={IMG_KIVICUBE_LOGO}
                          alt="Kivicube logo"
                          loading="lazy"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-white text-sm font-medium">关于 Kivicube</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          Kivicube 是国内零代码 AR 创作平台，提供WebAR / 小程序AR / AppAR 多端发布能力，
                          适合快速原型验证；但在多目标同步识别与复杂骨骼动画方面存在一定局限。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2.5 团队分工 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-400" />
                      <h4 className="text-white text-sm font-semibold">团队分工</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: '项诚皓', role: '前期构想 / PPT / IP建模 / 动画', highlight: true },
                        { name: '李茗宇', role: 'Unity AR 程序编写', highlight: false },
                        { name: '朱奕恒', role: '视觉卡牌 IP 设计', highlight: false },
                        { name: '秦文渊', role: '动画 / 宣传片剪辑', highlight: false },
                      ].map((m) => (
                        <div
                          key={m.name}
                          className={`p-3.5 rounded-xl border text-center ${
                            m.highlight
                              ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                              : 'border-white/10 bg-white/[0.02]'
                          }`}
                        >
                          <div className={`text-sm font-semibold ${m.highlight ? 'text-emerald-200' : 'text-white/90'}`}>
                            {m.name}
                          </div>
                          <div className={`text-[10.5px] mt-1 leading-relaxed ${m.highlight ? 'text-emerald-300/60' : 'text-white/45'}`}>
                            {m.role}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ========== 第三阶段：玩法设计与迭代 ========== */}
              <section>
                <PhaseHeader num="03" title="玩法设计与迭代" subtitle="Phase 3 · Game Design & Iteration" tone="3" />
                <div className="pl-[68px] space-y-8">
                  {/* 3.1 卡牌获取方式 + 3.2 卡牌类型 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                      <h4 className="text-white text-sm font-semibold">卡牌获取方式</h4>
                      <ul className="space-y-2.5">
                        {[
                          ['景点打卡解锁', '小程序地图引导到达特定地点，完成 AR 拍照或知识问答'],
                          ['文创盲盒购买', '9.9 - 19.9 元 / 包，稀有度 N/R/SR/SSR + 盲盒机制'],
                          ['特殊任务奖励', '完成特定游览路线或消费任务获得限定稀有卡牌'],
                        ].map(([t, d]) => (
                          <li key={t} className="flex gap-3">
                            <span className="shrink-0 w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                              ✓
                            </span>
                            <div>
                              <div className="text-white/90 text-xs font-medium">{t}</div>
                              <div className="text-white/50 text-[11px] leading-relaxed mt-0.5">{d}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                      <h4 className="text-white text-sm font-semibold">四大卡牌类型</h4>
                      <ul className="space-y-2.5">
                        {[
                          ['文物卡', '广富林出土的陶器、玉器、骨针，手机扫描让文物"活"过来'],
                          ['建筑卡', '水下博物馆、知也禅寺、三元宫等标志性建筑'],
                          ['人物卡', '陈子龙等历史人物，以 Q 版 3D 形象"走出"卡牌'],
                          ['场景卡', '水上建筑群、考古现场，AR 技术"穿越"回千年前'],
                        ].map(([t, d]) => (
                          <li key={t} className="flex gap-3">
                            <span className="shrink-0 w-5 h-5 rounded-md bg-violet-500/15 border border-violet-500/25 text-violet-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                              ◆
                            </span>
                            <div>
                              <div className="text-white/90 text-xs font-medium">{t}</div>
                              <div className="text-white/50 text-[11px] leading-relaxed mt-0.5">{d}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3.3 玩法方案1.0 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                      <h4 className="text-white text-sm font-semibold">玩法方案 1.0 · 卡牌对战系统"文明对决"</h4>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">(已废弃)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="text-white text-sm font-medium mb-1">属性克制</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          良渚 / 龙山 / 吴越三大文化属性形成环形克制关系（良渚克龙山 · 龙山克吴越 · 吴越克良渚）
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="text-white text-sm font-medium mb-1">能力维度</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          "历史底蕴" / "工艺匠心" / "文化融合"，分别对应攻击、防御、生命值数值
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="text-white text-sm font-medium mb-1">对战场景</div>
                        <p className="text-white/50 text-xs leading-relaxed">
                          遗址对战台（公园 AR 对战区）+ 线上好友约战（小程序匹配 + 排行榜段位）
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3.4 第一版废稿IP */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                      <h4 className="text-white text-sm font-semibold">第一版废稿 IP · v1.0（6 个角色）</h4>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">Draft · 已迭代</span>
                    </div>
                    <p className="text-white/55 text-xs leading-relaxed">
                      神面玉影（玉+灵）、夹砂鼎仔（陶+岩）、牌坊镇灵（岩+灵）、芦絮飘飘（风+草）、古土芽芽（土+草）、渡陶水影（水）。
                      后经迭代升级为更贴合广富林史前文明主题的 2.0 七角色体系。
                    </p>
                    <DraftCharacterStrip />
                  </div>

                  {/* 3.5 技术迭代过程 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                      <h4 className="text-white text-sm font-semibold">技术迭代 · 从倾斜检测到三分式联动</h4>
                    </div>
                    <div className="flex items-stretch gap-3">
                      <div className="flex-1 p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.04]">
                        <div className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1.5">最初想法</div>
                        <p className="text-white/65 text-xs leading-relaxed">
                          通过摄像头赋予卡牌初始位置值，检测卡牌倾斜角度变化，从而控制 AR 角色做出不同的动作反馈。
                        </p>
                      </div>
                      <div className="flex items-center text-white/30 px-1">
                        <span className="text-lg">→</span>
                      </div>
                      <div className="flex-1 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                        <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1.5">测试发现</div>
                        <p className="text-white/65 text-xs leading-relaxed">
                          只依靠摄像头无法测量卡牌的倾斜角度信息，方案技术上行不通。
                        </p>
                      </div>
                      <div className="flex items-center text-white/30 px-1">
                        <span className="text-lg">→</span>
                      </div>
                      <div className="flex-1 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06]">
                        <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1.5">最终方案</div>
                        <p className="text-white/70 text-xs leading-relaxed">
                          另辟蹊径改变玩法，从"卡牌倾斜控制"改为"三分式卡牌联动 AR 机制"。
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <figure className="rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                          <div className="aspect-video bg-black/30 flex items-center justify-center">
                            <Image src={IMG_UNITY_SCENE} alt="Unity AR场景搭建" loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <figcaption className="px-2 py-1.5 text-[10px] text-white/50 text-center">Unity AR 场景搭建</figcaption>
                        </figure>
                        <figure className="rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                          <div className="aspect-video bg-black/30 flex items-center justify-center">
                            <Image src={IMG_BLENDER_OBS_1} alt="Blender建模+OBS录屏" loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <figcaption className="px-2 py-1.5 text-[10px] text-white/50 text-center">Blender 角色建模</figcaption>
                        </figure>
                        <figure className="rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                          <div className="aspect-video bg-black/30 flex items-center justify-center">
                            <Image src={IMG_BLENDER_OBS_2} alt="Blender建模+OBS录屏" loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <figcaption className="px-2 py-1.5 text-[10px] text-white/50 text-center">OBS 动作录屏</figcaption>
                        </figure>
                      </div>
                      <p className="text-white/50 text-[11px] leading-relaxed text-center">
                        Unity AR 场景搭建 + Blender 角色建模 + OBS 动作录屏 — 完整技术实现工作流
                      </p>
                    </div>
                  </div>

                  {/* 3.6 玩法方案2.0 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-white text-sm font-semibold">
                        玩法方案 2.0 · 三分式实体卡牌联动 AR 机制
                      </h4>
                      <span className="text-[10px] text-emerald-300/80 uppercase tracking-wider font-semibold">Final</span>
                    </div>
                    <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                      <div className="text-white/90 text-sm font-medium mb-3">核心概念</div>
                      <p className="text-white/70 text-sm leading-relaxed mb-4">
                        将广富林史前文明拆解为三类独立可收集实体卡牌：
                        <span className="text-emerald-300 font-medium"> 文物人物精灵卡 </span>+
                        <span className="text-emerald-300 font-medium"> 场景卡 </span>+
                        <span className="text-emerald-300 font-medium"> 动作卡</span>。
                        用户搭配三类卡牌组合，手机扫描卡组后，Unity AR Foundation 渲染一套专属连贯 3D 动画。
                      </p>
                      <ul className="space-y-2">
                        <li className="flex gap-2 text-white/60 text-xs">
                          <span className="text-emerald-400 shrink-0">▸</span>
                          通过不同卡牌的排列、替换、叠加，以拼装互动的形式让玩家亲手"搭建文明"
                        </li>
                        <li className="flex gap-2 text-white/60 text-xs">
                          <span className="text-emerald-400 shrink-0">▸</span>
                          基础规则：必须同时识别人物卡 + 场景卡才能生成基础 AR 画面；动作卡为拓展互动道具
                        </li>
                        <li className="flex gap-2 text-white/60 text-xs">
                          <span className="text-emerald-400 shrink-0">▸</span>
                          依据不同时期出土文物、生活环境、行为习惯特点设计人物与动作，赋予文物新生命
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 3.7 第二版最终IP（七大角色） */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-white text-sm font-semibold">第二版最终 IP · 七大精灵系列 v2.0</h4>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">
                      广富林文明主题 3D 精灵系列 IP，以良渚玉璧、龙山陶器文物为原型打造，提炼轻量化神人兽面纹作为视觉符号。
                      涵盖石·骨·岩·陶·玉 五大属性体系，每个角色拥有独立属性、性格与技能。
                    </p>
                    <IPCharacterStrip />
                  </div>
                </div>
              </section>

              {/* ========== 第四阶段：技术实现与产品落地 ========== */}
              <section>
                <PhaseHeader num="04" title="技术实现与产品落地" subtitle="Phase 4 · Tech & Production" tone="4" />
                <div className="pl-[68px] space-y-8">
                  {/* 4.1 技术实现 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-white text-sm font-semibold">技术实现</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { t: 'Unity VUFORIA', d: 'AR 场景搭建与多目标图像识别引擎' },
                        { t: 'C# 脚本开发', d: '在 ChatGPT 和 DeepSeek 辅助下完成交互逻辑' },
                        { t: 'Unity 编辑器', d: '场景编辑、动画状态机、粒子特效集成' },
                      ].map((x) => (
                        <div key={x.t} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                          <div className="text-white text-sm font-medium mb-1">{x.t}</div>
                          <p className="text-white/50 text-xs leading-relaxed">{x.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4.2 卡牌设计 3.0 + 4.3 动画迭代 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                      <h4 className="text-white text-sm font-semibold">卡牌设计 3.0</h4>
                      <ul className="space-y-2 text-white/60 text-xs">
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>卡牌封面设计：复古卡牌风格，每个角色独立封面</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>卡牌背面设计：统一纹样背面</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>场景卡牌设计：广富林场景插画</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>动作卡牌设计：动作技能插画</li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                      <h4 className="text-white text-sm font-semibold">卡牌动画设计</h4>
                      <ul className="space-y-2 text-white/60 text-xs">
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>从 1.0 到 2.0 迭代，不断优化角色动画效果</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>每个角色拥有独立的待机动画</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>每个角色拥有独立的技能动画</li>
                        <li className="flex gap-2"><span className="text-emerald-400">▸</span>多卡牌组合生成专属连贯 3D 动画</li>
                      </ul>
                    </div>
                  </div>

                  {/* 4.4 产品说明 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-white text-sm font-semibold">产品说明 · 实体卡牌</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <StatCard value="2mm" label="亚克力板材厚度" accent="text-emerald-300" />
                      <StatCard value="10×15cm" label="统一尺寸" />
                      <StatCard value="18张" label="全套卡牌数" accent="text-amber-300" />
                      <StatCard value="5元" label="单张加工均价" />
                      <StatCard value="90元" label="整套成本" accent="text-emerald-300" />
                    </div>
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-white text-sm font-medium mb-2">制作工艺</div>
                          <ul className="space-y-1.5 text-white/60 text-xs">
                            <li className="flex gap-2"><span className="text-white/30">·</span>选用 2mm 透明亚克力板材</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>正面 UV 彩印图案</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>背面磨砂防滑处理</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>CNC 精准切割，圆角抛光</li>
                          </ul>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium mb-2">落地可行性</div>
                          <ul className="space-y-1.5 text-white/60 text-xs">
                            <li className="flex gap-2"><span className="text-white/30">·</span>亚克力耐磨防水，适合展馆长期使用</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>使用免费 Unity 引擎，无授权费用</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>印刷切割工艺市面通用，可大批量定制</li>
                            <li className="flex gap-2"><span className="text-white/30">·</span>展馆研学、校园课堂均可落地</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <ImageTextCard
                      src={IMG_CARD_SIZE}
                      caption="卡牌尺寸标注设计图 · 10cm × 6.5cm × 2mm 亚克力板材，CNC 精准切割，边角做圆角抛光。"
                      bgWhite
                    />
                  </div>

                  {/* 4.5 项目成果展示 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-white text-sm font-semibold">项目成果展示</h4>
                    </div>
                    <p className="text-white/60 text-xs">
                      产品效果图 · 测试视频 · 布展效果图 · 宣传海报 · 后续周边包装 — 全链路成果落地验证
                    </p>
                    <ShowcaseGrid />
                  </div>
                </div>
              </section>

              {/* ========== 第五阶段：商业闭环 ========== */}
              <section>
                <PhaseHeader num="05" title="商业闭环" subtitle="Phase 5 · Business Model" tone="5" />
                <div className="pl-[68px] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        title: '引流 · 获客',
                        tone: 'rose',
                        items: [
                          '游客中心等人流密集区设 AR 互动大屏，展示稀有卡牌和精美 AR 特效',
                          '鼓励游客分享 AR 打卡照或对战截图到社交平台',
                          '集赞可兑换卡包或限定周边，形成社交媒体传播',
                        ],
                      },
                      {
                        title: '变现模式',
                        tone: 'amber',
                        items: [
                          '售卖实体 AR 卡包（核心营收），9.9-19.9 元 / 包',
                          '稀有度设计 N/R/SR/SSR + 盲盒机制，驱动复购',
                          '景区餐饮联名套餐送特殊卡牌，相互导流',
                          'AR 打卡任务奖励消费抵扣券，形成消费良性循环',
                        ],
                      },
                      {
                        title: '复购 · 留存',
                        tone: 'emerald',
                        items: [
                          '小程序内设卡牌交换区，鼓励玩家社交',
                          '集齐特定套卡可兑换实体纪念品，吸引重游',
                          '定期举办线下卡牌对战赛、AR 寻宝赛',
                          '将公园打造为桌游与文旅爱好者的周期性聚集地',
                        ],
                      },
                    ].map((block) => (
                      <div
                        key={block.title}
                        className="p-5 rounded-xl border border-white/10 bg-white/[0.02]"
                      >
                        <div className="text-white text-sm font-semibold mb-3.5">{block.title}</div>
                        <ul className="space-y-2.5">
                          {block.items.map((it) => (
                            <li key={it} className="flex gap-2 text-white/60 text-xs leading-relaxed">
                              <span className="text-white/30 shrink-0 mt-1">◆</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ========== 视频播放窗口 ========== */}
              <section className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <SectionLabel tone="violet">Showcase Video</SectionLabel>
                  <h3 className="text-white font-semibold" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2vw, 22px)' }}>
                    项目宣传视频
                  </h3>
                </div>
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '50vh' }}
                  />
                </div>
                <p className="text-white/40 text-xs text-center mt-3">
                  点击播放按钮观看 GFL-AR次元纪 完整项目展示
                </p>
              </section>

              {/* ========== 底部 ========== */}
              <footer className="pt-6 pb-2 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-white/40 text-xs">
                  GFL-AR DIMENSION CHRONICLES · 广富林文明主题多卡牌组合 AR 交互设计
                </div>
                <div className="text-white/30 text-xs">
                  © 2025 · 项诚皓 / 李茗宇 / 秦文渊 / 朱奕恒
                </div>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
