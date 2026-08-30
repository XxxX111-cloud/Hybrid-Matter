# Mainframe Creative Agency - 需求拆解文档

## 产品概述

- **产品类型**: 创意机构品牌落地页（Hero Landing Page）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 潜在客户、合作伙伴、求职者 — 访问 Mainframe 创意机构官网的访客
- **核心价值**: 通过沉浸式鼠标操控背景视频 + 打字机对话式文案 + 胶囊按钮行动召唤，打造高质感的创意机构第一印象，引导访客联系或了解更多
- **界面语言**: 英文（所有文案为英文）
- **主题偏好**: user_specified（黑白极简、视频背景）
- **导航模式**: 锚点导航（单页落地页）
- **导航布局**: Topbar（顶部固定导航栏）

---

## 页面结构总览

**页面文件**: `HomePage.tsx`（单页落地页，全屏 Hero）

| 区块名称 | 锚点 | 区块说明 |
|---------|------|---------|
| Background Video | 无（全屏固定背景） | 全屏固定背景视频，通过鼠标水平移动 scrub 控制播放进度 |
| Navbar | `#top` | 顶部固定导航栏，含 Logo、桌面导航链接、CTA、移动端汉堡菜单与全屏遮罩 |
| Hero Section | `#hero` | 首屏主视觉区，含模糊介绍标签、打字机文本、行动胶囊按钮组 |

> **说明**：用户需求仅明确要求一个全屏 Hero landing page，不包含 About/Services/Contact 等下方内容区块。按"宁少勿多"原则，仅规划用户明确指定的三个核心层（背景视频、导航栏、Hero 内容）。

---

## 页面布局建议

- **布局模式**: 全屏单页（Full-screen overlay layout）—— 三层叠加结构：背景视频层（z-0）→ Hero 内容层（z-1）→ 导航栏层（z-10）
- **视觉重心**: 内容 —— Hero 文字和行动按钮为视觉焦点，背景视频作为氛围衬托
- **结果承载区**: 不适用（展示型落地页，无输入/输出工作流）
- **响应式策略**: 移动端内容底部对齐（`justify-end pb-12`），桌面端垂直居中（`justify-center`）；导航栏移动端用汉堡菜单 + 全屏遮罩

---

## 导航配置

- **导航布局**: Topbar（顶部固定，z-index: 10）
- **导航项**:

| 导航文字 | 锚点 / 链接 | 说明 |
|---------|------------|------|
| Mainframe® | `#top` | Logo + 星号装饰，使用 heading 字体 |
| Labs | `#labs` | 桌面端居中显示，逗号分隔 |
| Studio | `#studio` | 桌面端居中显示，逗号分隔 |
| Openings | `#openings` | 桌面端居中显示，逗号分隔 |
| Shop | `#shop` | 桌面端居中显示，逗号分隔 |
| Get in touch | `mailto:hello@mainframe.co` | 桌面端右侧，下划线样式 |
| 汉堡菜单 | — | 移动端（md 以下）显示，点击展开全屏遮罩导航 |

> **说明**：Labs / Studio / Openings / Shop 为用户明确指定的导航链接，均为锚点形式（单页内跳转占位）。移动端汉堡菜单展开后显示相同链接 + Get in touch。

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 背景视频播放 | real-api | 直接在 `<video>` 标签中引用用户提供的 CDN 视频 URL，通过 mousemove 事件控制 currentTime 实现 scrub 效果 | 视频加载失败时展示静态 fallback 背景色（不阻塞页面功能） |
| 字体资源 | real-api | 通过 `index.html` 的 `<link>` 标签引入 OnlineWebFonts 的两个字体 CSS | 字体加载失败时回退到 `'Helvetica Neue', Arial, sans-serif` 系统字体栈 |
| 邮箱复制 | import-export | 点击邮箱按钮调用 `navigator.clipboard.writeText('hello@mainframe.co')` 复制到剪贴板 | 复制成功/失败用 toast 或按钮文案变化反馈 |
| 打字机文案 | demo-mock | 文本内容硬编码在组件中，通过 `useTypewriter` hook 逐字显示 | ✅ 本身就是静态文案，直接使用 |
| 导航与按钮文案 | demo-mock | 所有导航、按钮、Hero 文案均为静态硬编码 | ✅ 本身就是静态文案，直接使用 |

---

## 功能列表

### Background Video（背景视频层）

- **页面目标**: 提供沉浸式全屏背景，通过鼠标水平移动控制视频播放进度，营造互动创意氛围
- **功能点**:
  - **全屏视频背景渲染**: `<video>` 元素 `position: fixed; inset: 0; z-index: 0; object-fit: cover; object-position: 70% center`，muted、playsInline、preload="auto"，**不自播**
  - **鼠标 scrub 控制**: 监听 `window` 的 `mousemove` 事件，追踪 `prevX`，计算 `delta = currentX - prevX`，转换为时间偏移 `(delta / window.innerWidth) * SENSITIVITY * video.duration`（SENSITIVITY = 0.8），clamp 到 [0, video.duration] 范围
  - **防 seek 洪水机制**: 使用 `targetTime` 变量 + `onSeeked` 事件回调，当前一次 seek 完成后再执行下一次，避免频繁设置 `currentTime` 导致的性能问题

### Navbar（导航栏）

- **页面目标**: 品牌识别 + 站点导航 + 联系入口，桌面端与移动端有不同呈现
- **功能点**:
  - **Logo 展示**: 左侧 "Mainframe®" 文字 + `✳︎` 星号装饰，使用 `var(--font-heading)`，响应式字号
  - **桌面导航链接**: 居中显示 "Labs, Studio, Openings, Shop"，逗号分隔，hover 时 opacity 变为 60% 带过渡动画（仅 md 以上可见）
  - **桌面 CTA**: 右侧 "Get in touch" 下划线链接，hover 透明度变化（仅 md 以上可见）
  - **移动端汉堡菜单**: md 以下显示三条横线按钮，点击切换开/关状态；顶部条旋转 45° 下移 7px，中间条淡出，底部条旋转 -45° 上移 7px，均为 300ms 过渡
  - **移动端全屏遮罩**: z-index: 9，`fixed inset-0 bg-white/95 backdrop-blur-sm`，垂直居中左对齐，显示大号导航链接 + Get in touch，通过 opacity + pointerEvents 控制显隐

### Hero Section（首屏主内容）

- **页面目标**: 以对话式打字机效果介绍 A.R.I.A 智能体，引导访客点击行动按钮建立联系
- **功能点**:
  - **模糊介绍标签**: 两行文字 "Hey there, meet A.R.I.A," / "Mainframe's Adaptive Response Interface Agent"，`filter: blur(4px)`，不可选中不可点击，营造层次感
  - **打字机效果**: 自定义 `useTypewriter` hook（text/speed/startDelay 参数，默认 38ms/600ms），逐字显示 `"Glad you stopped in. Good taste tends to find us. Now, what are we building?"`，打字中显示闪烁光标（CSS blink 动画），完成后光标消失
  - **行动胶囊按钮组**: 4 个白色实心按钮（"Pitch us an idea"、"Come work here"、"Send a brief hello"、"See how we operate"）+ 1 个白色描边邮箱按钮，页面加载 400ms 后淡入上滑（与打字机动画独立），hover 时背景文字反色
  - **邮箱复制功能**: 描边按钮显示 "Reach us: hello@mainframe.co" + 12x12 复制图标（双矩形 SVG），点击调用 `navigator.clipboard.writeText()` 复制邮箱地址

---

## 技术实现细节说明

> **说明**：以下为用户需求中明确指定的技术细节，供下游设计与开发阶段严格遵守

### 字体配置

- `index.html` 中通过 `<link>` 引入两个字体样式表
- `index.css` 中定义 CSS 变量 `--font-heading` 和 `--font-body`
- 全局使用 `var(--font-body)`，仅 Logo 使用 `var(--font-heading)`

### 自定义 Hook

- **`useTypewriter`**: 输入 `{ text, speed?, startDelay? }`，输出 `{ displayed, done }`；内部使用 `setInterval` 逐字追加，600ms 延迟后启动，默认每字 38ms

### 动画关键帧

- **`blink`**: 光标闪烁动画，`opacity: 1` at 0%/100%, `opacity: 0` at 50%，`step-end` 时序函数，1s 周期无限循环
- **按钮淡入上滑**: `opacity 0->1` + `translateY(8px)->0`，0.4s ease 过渡，延迟 400ms 触发

### 依赖约束

- 仅使用 React、ReactDOM、Tailwind CSS、Vite
- 不使用其他 UI 库（Lucide-react 可用但本组件不使用，复制图标用内联 SVG 实现）

-------

<scene_type>landing-page</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Exact Reference —— 需求给出逐像素级细节（字体、视频控制、导航结构、打字机动画、胶囊按钮样式），视觉与交互均按用户规格高保真还原。
- **核心情绪 / 应用类型**: 创意机构品牌 Landing 页，以 "A.R.I.A 自适应响应界面代理" 为人格化入口，冷静、精准、带对话感与好奇感。
- **独特记忆点**: 全屏视频随鼠标水平移动逐帧 scrub，叠加失焦的介绍文字与逐字打出的对话文案，营造"与智能代理初次会面"的仪式感。

## 2. Art Direction

- **方向名**: Swiss Editorial + Interactive Film
- **Design Style**: 瑞士极简排版 + 电影级交互背景 —— Helvetica Now 的精确字形、黑白强对比、胶囊按钮的克制圆润，与动态视频背景共同构成冷静又具张力的品牌第一印象。
- **DNA 参数**: 圆角 pill（`rounded-full` 用于按钮）/ 阴影 none（文字与按钮靠对比本身）/ 间距 spacious（Hero 大留白，按钮组紧凑堆叠）/ 字体方向：Helvetica 系无衬线、紧字距 / 装饰手法：失焦模糊文字、打字机光标、星号徽标、视频 scrub。
- **应用类型**: Landing —— 全屏 Hero 主导，单屏叙事，行动点集中于胶囊按钮群。

## 3. Color System

**色彩关系**: 纯黑文字 + 纯白交互面 + 视频做动态背景；按钮黑白反转承担交互反馈，无彩色主色以保持高级编辑感。
**配色设计理由**: 创意机构品牌以黑白建立权威与克制感，视频内容承担情绪与色彩；primary 角色由"黑底白字/白底黑字"反转承担，accent 用极淡灰承接 hover 前后的细微层级。
**主色推导**: 需求通篇使用 black / white / black-10% border 的黑白系统，品牌识别来自字体、排版与视频交互，而非彩色主色；primary 即为纯黑（#000），用于 Logo、文字、按钮反转态。
**使用比例**: 70% 透明/视频底 / 25% 黑白中性 / 5% 交互反转；无彩色 primary，品牌记忆点来自排版与动效而非色相。

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(0 0% 100%) | 页面基底（视频上的文字区 fallback） |
| card | `--card` | `bg-card` | hsl(0 0% 100%) | 白色胶囊按钮、弹层、菜单承载面 |
| text | `--foreground` | `text-foreground` | hsl(0 0% 0%) | 标题、正文、Logo、导航链接 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(0 0% 40%) | 辅助说明、占位文字 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(0 0% 0%) | 主交互反转态、hover 填充、品牌锚点 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(0 0% 100%) | 黑色按钮/底上的文字与图标 |
| accent | `--accent` | `bg-accent` | hsl(0 0% 96%) | 极浅灰、hover 过渡态、骨架屏底 |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(0 0% 0%) | accent 上的文字与图标 |
| border | `--border` | `border-border` | hsl(0 0% 90%) | 白色胶囊按钮的 10% 黑边、菜单分隔线 |

**语义色提示**: 无。本页为纯黑白品牌系统，成功/警告/错误状态在后续业务页面再引入；若需复制成功反馈，使用 hsl(0 0% 0%) 背景 + 白色文字的 toast，保持同一克制语言。

## 4. 字体与节奏

- **font-display**: HelveticaNowDisplay-Medium —— 仅用于 Logo "Mainframe(R)"，紧字距、中粗，承载品牌识别。
- **font-body**: HelveticaNowDisplayW01-Rg —— 全站正文、导航、按钮、打字机文案，常规字重，字形现代精确，符合瑞士编辑设计气质。
- **字号**: Hero 正文 `clamp(18px, 4vw, 26px)`；Logo `text-[21px] sm:text-[26px]`；桌面导航 `text-[23px]`；移动菜单 `text-[32px]`；胶囊按钮 `text-[13px] sm:text-[15px]`。
- **圆角**: 极端（pill 圆形）—— 按钮全部 `rounded-full`，与方正字体和黑白系统形成柔化对比。

## 5. 全局布局契约

- **Reference Layout Use**: Exact Reference。视频全屏固定、顶部 fixed 导航、Hero 内容左对齐 `max-w-xl`、移动端底部停靠/桌面垂直居中，均严格按需求规格实现。
- **Page / Section Order**: 单页全屏 Hero，含 Navbar + Hero（模糊标签 + 打字机文案 + 胶囊按钮组）。
- **Standard Content Zone**: Hero 内容容器 `max-w-xl`，`px-5 sm:px-8 md:px-10`；导航全宽通栏。
- **Shell / Frame Alignment**: 导航为独立 fixed 层，内容区水平 padding 与导航对齐（同 padding 节奏），但内容容器 max-w 独立收窄。
- **Padding & Rhythm**: 导航 `px-5 sm:px-8 py-4 sm:py-5`；Hero `px-5 sm:px-8 md:px-10`，垂直方向移动 `pb-12`、桌面 `justify-center`。
- **Full-bleed Zones**: 视频背景 `fixed inset-0` 全宽全高；导航条全宽；Hero 文字受 `max-w-xl` 约束。
- **Local Narrowing**: Hero 正文天然收窄至 `max-w-xl`，符合阅读行长。
- **Overflow Strategy**: 胶囊按钮使用 `flex flex-wrap` 换行；视频使用 `object-fit: cover` 裁切。
- **Flexibility Boundary**: 允许移动端按钮字号、间距微调；不允许改变黑白系统、pill 圆角、字体选择与视频 scrub 交互逻辑。

## 6. 视觉与动效

- **装饰**: 失焦模糊标签、星号徽标 `✳︎`、打字机闪烁光标。
- **阴影/边界**: 无阴影；边界极细（`border-black/10`），白色按钮靠细边与视频背景分离。
- **动效**: 精致克制 —— 鼠标横向移动驱动视频逐帧 scrub 为核心动效；打字机逐字出现 + 光标闪烁；胶囊按钮组 400ms 延迟淡入上滑；链接 hover 60% 透明度过渡；按钮 hover 黑白颜色反转 200ms；汉堡菜单三条线 300ms 变形 + 移动菜单淡入。

## 7. 组件原则

- 胶囊按钮分两种：白底黑边（主行动群）与透明白边（邮件联系），hover 均反色。
- 链接 hover 使用 `opacity-60 transition-opacity`，不做下划线增长等多余动效。
- 所有可交互元素（按钮、链接、汉堡菜单）需补充 `:focus-visible` 环（2px 黑边 + 2px 白边偏移），保持键盘可达。
- 邮件按钮点击复制后应有微反馈（如短暂文字变更为 "Copied!" 2 秒后恢复），延续黑白语言。
- 加载与视频未就绪时，使用深灰占位底 + 模糊层，避免白屏突兀。

## 8. Image Direction

- **Image Role**: 全屏动态背景（Hero video），承载品牌情绪与场景感，是页面主角之一。
- **Image Art Direction**: 视频为创意工作室/科技感实景，偏冷调、有建筑线条与光影流动；`object-position: 70% center` 使视觉重心偏右，左侧留出文字区；画面需有足够暗部区域保证黑色文字可读，避免过亮或高饱和色块冲击排版。
- **Image Prompt Keywords**: creative studio interior, abstract architectural lines, soft natural light, monochromatic tones, concrete and glass textures, slow camera movement, depth of field, moody atmosphere, minimal composition, high-end production
- **Image Avoidance**: 避免彩色霓虹、赛博朋克光效、人物正脸特写、商务握手素材、明显的 AI 生成人脸、过亮纯白天空、杂乱多色块环境；视频整体需低调，服务文字而非抢夺注意力。

## 9. Anti-patterns

- **Color creep**: 忍不住加入品牌蓝/紫渐变点缀；本页严格黑白，品牌识别靠字体、排版与交互，不靠色相。
- **Video autoplay**: 把视频做成自动播放循环；核心体验是鼠标 scrub 控制，自动播放会消解交互仪式感。
- **Button bloat**: 给胶囊按钮加阴影、加图标、加渐变；按钮靠黑白反转与细边说话，越少越高级。
- **Typewriter overdrive**: 打字机速度过慢或加入过多音效/弹跳；38ms 每字、平稳出现、仅配闪烁光标即足够。
- **Mobile afterthought**: 移动端只做等比缩小；移动版 Hero 内容靠底部停靠、导航换汉堡叠加层，是独立布局而非缩放。
- **Font fallback neglect**: 第三方字体加载失败时页面崩坏；必须配好 Helvetica Neue → Arial → sans-serif 回退栈，保证气质接近。