import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DomeGallery from '@/components/dome-gallery/DomeGallery';

const PHOTOS = [
  { src: 'https://aka.doubaocdn.com/s/7FEPFkV94y', alt: 'Photography Series · 维纳斯雕塑与大卫头像' },
  { src: 'https://aka.doubaocdn.com/s/jeLcYNVxGq', alt: 'Photography Series · 木门福字与彩色灯笼' },
  { src: 'https://aka.doubaocdn.com/s/wQwQqGUQGv', alt: 'Photography Series · 幸福裁缝铺墙体涂鸦' },
  { src: 'https://aka.doubaocdn.com/s/UVsQFnsSUp', alt: 'Photography Series · 林间红梯艺术展画' },
  { src: 'https://aka.doubaocdn.com/s/kfjMIdCBhC', alt: 'Photography Series · 城市的仓 粉绿文字橱窗' },
  { src: 'https://aka.doubaocdn.com/s/NOGw5YS8RG', alt: 'Photography Series · 石板路与藤蔓老墙' },
  { src: 'https://aka.doubaocdn.com/s/bgU96v0hsz', alt: 'Photography Series · 红灯笼与斑驳墙面' },
  { src: 'https://aka.doubaocdn.com/s/4VfKNvacBr', alt: 'Photography Series · 旧砖门与传统纹样' },
  { src: 'https://aka.doubaocdn.com/s/4cYl75hzU4', alt: 'Photography Series · 街角灯笼与飞檐' },
  { src: 'https://aka.doubaocdn.com/s/znVPc4Dyya', alt: 'Photography Series · 木门细节与对联' },
  { src: 'https://aka.doubaocdn.com/s/pCB24bwkkP', alt: 'Photography Series · 老墙与光影' },
  { src: 'https://aka.doubaocdn.com/s/kZWMpldBwM', alt: 'Photography Series · 石墩与古巷入口' },
  { src: 'https://aka.doubaocdn.com/s/zRSHjjXiOp', alt: 'Photography Series · 传统花窗与绿植' },
  { src: 'https://aka.doubaocdn.com/s/viCLfW87GK', alt: 'Photography Series · 藤蔓覆盖的红色楼梯' },
  { src: 'https://aka.doubaocdn.com/s/WcgAw5tNm7', alt: 'Photography Series · 灯笼特写与木门纹理' },
  { src: 'https://aka.doubaocdn.com/s/CJlQEzD7UK', alt: 'Photography Series · 涂鸦卷帘门与红砖墙' },
  { src: 'https://aka.doubaocdn.com/s/5eI27DMPdI', alt: 'Photography Series · 维纳斯雕塑与大卫头像（外景）' },
  { src: 'https://aka.doubaocdn.com/s/9DAhi5I13q', alt: 'Photography Series · 巷弄里的黄色出租车' },
  { src: 'https://aka.doubaocdn.com/s/BN0zyskqQD', alt: 'Photography Series · 黄昏阳光穿过巷弄' },
  { src: 'https://aka.doubaocdn.com/s/nECrQGzHLg', alt: 'Photography Series · 老街上的行人剪影' },
  { src: 'https://aka.doubaocdn.com/s/y4zJNF5mad', alt: 'Photography Series · 密林间的丁达尔光束' },
  { src: 'https://aka.doubaocdn.com/s/Ujzb7tLUVg', alt: 'Photography Series · 城市桥下的批发市场' },
  { src: 'https://aka.doubaocdn.com/s/PYaQ4Lj2wE', alt: 'Photography Series · 夜幕下的黄色出租车阵' },
  { src: 'https://aka.doubaocdn.com/s/83THGBNkFO', alt: 'Photography Series · 香港斜坡街巷与行人' },
  { src: 'https://aka.doubaocdn.com/s/YvZq7KjPxg', alt: 'Photography Series · 林间阳光穿透树枝' },
  { src: 'https://aka.doubaocdn.com/s/mziUVtpagD', alt: 'Photography Series · 老街区黄昏光影' },
  { src: 'https://aka.doubaocdn.com/s/F2pddQYpXW', alt: 'Photography Series · 巷弄涂鸦与雕塑装置' },
  { src: 'https://aka.doubaocdn.com/s/wdiO4VDbug', alt: 'Photography Series · 巴士车窗里的京都街景' },
  { src: 'https://aka.doubaocdn.com/s/UqQ0257lOz', alt: 'Photography Series · 建筑剪影与粉橘色晚霞' },
  { src: 'https://aka.doubaocdn.com/s/2rPq2sAkUK', alt: 'Photography Series · 河畔垂柳落日倒影' },
  { src: 'https://aka.doubaocdn.com/s/FZLGBW1KmJ', alt: 'Photography Series · 港口老汉与猎兔犬' },
  { src: 'https://aka.doubaocdn.com/s/KA1iyMgleY', alt: 'Photography Series · 博物馆前的鹿群' },
  { src: 'https://aka.doubaocdn.com/s/SOygO1qdSw', alt: 'Photography Series · 街边花店与红色单车' },
  { src: 'https://aka.doubaocdn.com/s/dcDxNfLuU0', alt: 'Photography Series · 蓝调时刻的城市天际线' },
  { src: 'https://aka.doubaocdn.com/s/CPaYi32p6y', alt: 'Photography Series · 霓虹灯下的雨夜街道' },
  { src: 'https://aka.doubaocdn.com/s/qkJjryegIK', alt: 'Photography Series · 楼梯间的几何光影' },
];

export default function PhotographyPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* 顶部返回栏 */}
      <div className="fixed top-0 left-0 right-0 z-20 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          style={{ fontSize: '15px' }}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="text-white/60 text-sm">
          Photography Series
        </div>
      </div>

      {/* DomeGallery 全屏 */}
      <div className="fixed inset-0 z-0">
        <DomeGallery
          images={PHOTOS}
          grayscale={false}
          overlayBlurColor="#0a0a0a"
          fit={0.55}
          minRadius={400}
          segments={32}
          dragDampening={2}
          imageBorderRadius="24px"
          openedImageBorderRadius="24px"
          openedImageWidth="680px"
          openedImageHeight="900px"
          imageFit="contain"
        />
      </div>

      {/* 底部操作提示 */}
      <div className="fixed bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white/70 text-xs border border-white/10">
          拖拽浏览 · 点击放大 · ESC 关闭
        </div>
      </div>
    </div>
  );
}
