import { resolveAppUrl } from '@lark-apaas/client-toolkit-lite';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DomeGallery from '@/components/dome-gallery/DomeGallery';

const PHOTOS = [
  { src: resolveAppUrl('/assets/7FEPFkV94y.jpg'), alt: 'Photography Series · 维纳斯雕塑与大卫头像' },
  { src: resolveAppUrl('/assets/jeLcYNVxGq.jpg'), alt: 'Photography Series · 木门福字与彩色灯笼' },
  { src: resolveAppUrl('/assets/wQwQqGUQGv.jpg'), alt: 'Photography Series · 幸福裁缝铺墙体涂鸦' },
  { src: resolveAppUrl('/assets/UVsQFnsSUp.jpg'), alt: 'Photography Series · 林间红梯艺术展画' },
  { src: resolveAppUrl('/assets/kfjMIdCBhC.jpg'), alt: 'Photography Series · 城市的仓 粉绿文字橱窗' },
  { src: resolveAppUrl('/assets/NOGw5YS8RG.jpg'), alt: 'Photography Series · 石板路与藤蔓老墙' },
  { src: resolveAppUrl('/assets/bgU96v0hsz.jpg'), alt: 'Photography Series · 红灯笼与斑驳墙面' },
  { src: resolveAppUrl('/assets/4VfKNvacBr.jpg'), alt: 'Photography Series · 旧砖门与传统纹样' },
  { src: resolveAppUrl('/assets/4cYl75hzU4.jpg'), alt: 'Photography Series · 街角灯笼与飞檐' },
  { src: resolveAppUrl('/assets/znVPc4Dyya.jpg'), alt: 'Photography Series · 木门细节与对联' },
  { src: resolveAppUrl('/assets/pCB24bwkkP.jpg'), alt: 'Photography Series · 老墙与光影' },
  { src: resolveAppUrl('/assets/kZWMpldBwM.jpg'), alt: 'Photography Series · 石墩与古巷入口' },
  { src: resolveAppUrl('/assets/zRSHjjXiOp.jpg'), alt: 'Photography Series · 传统花窗与绿植' },
  { src: resolveAppUrl('/assets/viCLfW87GK.jpg'), alt: 'Photography Series · 藤蔓覆盖的红色楼梯' },
  { src: resolveAppUrl('/assets/WcgAw5tNm7.jpg'), alt: 'Photography Series · 灯笼特写与木门纹理' },
  { src: resolveAppUrl('/assets/CJlQEzD7UK.jpg'), alt: 'Photography Series · 涂鸦卷帘门与红砖墙' },
  { src: resolveAppUrl('/assets/5eI27DMPdI.jpg'), alt: 'Photography Series · 维纳斯雕塑与大卫头像（外景）' },
  { src: resolveAppUrl('/assets/9DAhi5I13q.jpg'), alt: 'Photography Series · 巷弄里的黄色出租车' },
  { src: resolveAppUrl('/assets/BN0zyskqQD.jpg'), alt: 'Photography Series · 黄昏阳光穿过巷弄' },
  { src: resolveAppUrl('/assets/nECrQGzHLg.jpg'), alt: 'Photography Series · 老街上的行人剪影' },
  { src: resolveAppUrl('/assets/y4zJNF5mad.jpg'), alt: 'Photography Series · 密林间的丁达尔光束' },
  { src: resolveAppUrl('/assets/Ujzb7tLUVg.jpg'), alt: 'Photography Series · 城市桥下的批发市场' },
  { src: resolveAppUrl('/assets/PYaQ4Lj2wE.jpg'), alt: 'Photography Series · 夜幕下的黄色出租车阵' },
  { src: resolveAppUrl('/assets/83THGBNkFO.jpg'), alt: 'Photography Series · 香港斜坡街巷与行人' },
  { src: resolveAppUrl('/assets/YvZq7KjPxg.jpg'), alt: 'Photography Series · 林间阳光穿透树枝' },
  { src: resolveAppUrl('/assets/mziUVtpagD.jpg'), alt: 'Photography Series · 老街区黄昏光影' },
  { src: resolveAppUrl('/assets/F2pddQYpXW.jpg'), alt: 'Photography Series · 巷弄涂鸦与雕塑装置' },
  { src: resolveAppUrl('/assets/wdiO4VDbug.jpg'), alt: 'Photography Series · 巴士车窗里的京都街景' },
  { src: resolveAppUrl('/assets/UqQ0257lOz.jpg'), alt: 'Photography Series · 建筑剪影与粉橘色晚霞' },
  { src: resolveAppUrl('/assets/2rPq2sAkUK.jpg'), alt: 'Photography Series · 河畔垂柳落日倒影' },
  { src: resolveAppUrl('/assets/FZLGBW1KmJ.jpg'), alt: 'Photography Series · 港口老汉与猎兔犬' },
  { src: resolveAppUrl('/assets/KA1iyMgleY.jpg'), alt: 'Photography Series · 博物馆前的鹿群' },
  { src: resolveAppUrl('/assets/SOygO1qdSw.jpg'), alt: 'Photography Series · 街边花店与红色单车' },
  { src: resolveAppUrl('/assets/dcDxNfLuU0.jpg'), alt: 'Photography Series · 蓝调时刻的城市天际线' },
  { src: resolveAppUrl('/assets/CPaYi32p6y.jpg'), alt: 'Photography Series · 霓虹灯下的雨夜街道' },
  { src: resolveAppUrl('/assets/qkJjryegIK.jpg'), alt: 'Photography Series · 楼梯间的几何光影' },
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
