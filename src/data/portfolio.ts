// EXPORTS: IWork, IAward, ISkill, ISkillCategory, MOCK_WORKS, MOCK_AWARDS, MOCK_SKILLS

export interface IWork {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface IAward {
  id: string;
  title: string;
  detail: string;
  year: string;
}

export interface ISkill {
  name: string;
}

export interface ISkillCategory {
  id: string;
  label: string;
  items: ISkill[];
}

export const MOCK_WORKS: IWork[] = [
  {
    id: 'yitao',
    title: '意陶',
    category: 'Interactive Installation / 交互装置',
    description:
      '以手势为媒，捏塑无形之念。将传统陶艺的"意"转化为数字交互的"形"，探讨数字时代手作精神的延续。',
    imageUrl: 'https://aka.doubaocdn.com/s/R20SI3H2tR',
  },
  {
    id: 'throat-civilization',
    title: '喉间文明',
    category: 'Interactive Installation',
    description:
      '综合类新实验装置作品，负责装置搭建以及 Arduino 交互程序实现，探索声音、身体与技术的边界。',
    imageUrl: 'https://aka.doubaocdn.com/s/0MuuMzXm5K',
  },
  {
    id: 'prepped-food-spring',
    title: '预制菜也有春天',
    category: 'Projection Mapping',
    description:
      '2025 重庆国际光影艺术节 Mapping 大赛决赛入围作品，以食物为载体的光影叙事实验。',
    imageUrl: 'https://aka.doubaocdn.com/s/ywy8QrfF6t',
  },
  {
    id: 'photography-series',
    title: 'Photography Series',
    category: 'Photography / 摄影',
    description:
      '城市影像与光影叙事系列，收录建筑、街景、自然与人物摄影作品。',
    imageUrl: 'https://aka.doubaocdn.com/s/7FEPFkV94y',
  },
  {
    id: 'dt-business-video',
    title: 'DT Business Observer',
    category: 'Video Production',
    description:
      '商业观察视频号剪辑与运营，负责从选题、脚本、拍摄到后期合成的完整视频生产流程。',
    imageUrl:
      'https://aka.doubaocdn.com/s/szq0KpKRcA',
  },
  {
    id: 'gfl-ar-dimension',
    title: 'GFL-AR次元纪',
    category: 'Interactive Installation / 交互装置',
    description:
      '广富林文明主题多卡牌组合 AR 交互设计，三分式实体卡牌联动 Unity VUFORIA 实现多目标同步识别与文明动画拼装。',
    imageUrl: 'https://aka.doubaocdn.com/s/QNNLqFnm5f',
  },
];

export const MOCK_AWARDS: IAward[] = [
  {
    id: 'scholarship',
    title: '校级三等综合奖学金',
    detail: '连续两年获得校内三等综合奖学金',
    year: '2024 / 2025',
  },
  {
    id: 'mapping-finalist',
    title: '重庆国际光影艺术节 Mapping 大赛 · 决赛入围',
    detail: '团队项目《预制菜也有春天》入选 2025 重庆国际光影艺术节 Mapping 大赛决赛',
    year: '2025',
  },
  {
    id: 'future-designer',
    title: '未来设计师·全国高校数字艺术设计大赛 · 上海赛区二等奖',
    detail: '作品《意陶》获第 13 届未来设计师 NCDA 上海赛区二等奖（负责整体交互程序编写）',
    year: '2025',
  },
  {
    id: 'future-designer-14th',
    title: '第 14 届未来设计师·全国高校数字艺术设计大赛省级赛陶瓷艺术与科技赛道上海赛区一等奖',
    detail: '作品《意陶》获第 14 届未来设计师·全国高校数字艺术设计大赛省级赛陶瓷艺术与科技赛道上海赛区一等奖',
    year: '2025',
  },
  {
    id: 'huichuang-youth',
    title: '汇创青春 · 综合类三等奖 / 国际赛优胜奖',
    detail:
      '装置作品《喉间文明》获第十届"汇创青春"综合类（新实验及装置）三等奖 / 国际赛优胜奖（负责装置搭建与 Arduino 交互程序实现）',
    year: '2025',
  },
];

export const MOCK_SKILLS: ISkillCategory[] = [
  {
    id: 'video',
    label: 'Video Editing',
    items: [{ name: '剪映' }, { name: 'Premiere Pro' }],
  },
  {
    id: '3d',
    label: '3D Modeling',
    items: [{ name: 'Blender' }, { name: 'SketchUp' }],
  },
  {
    id: 'dev',
    label: 'Development',
    items: [{ name: 'Visual Studio Code' }, { name: 'Web Development' }],
  },
  {
    id: 'touchdesigner',
    label: 'Interactive Installation',
    items: [
      { name: 'TouchDesigner' },
      { name: 'Music Visualization' },
      { name: 'Mapping Projection Calibration' },
    ],
  },
  {
    id: 'arduino',
    label: 'Hardware Interaction',
    items: [{ name: 'Arduino' }, { name: 'Physical Computing' }],
  },
  {
    id: 'other',
    label: 'Other Tools',
    items: [{ name: 'VVVV' }, { name: 'Cross-software Workflow' }],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    items: [{ name: '即梦' }, { name: 'Meshy AI' }, { name: 'Gemini' }],
  },
];
