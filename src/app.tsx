import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Layout } from "@/components/Layout";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import HomePage from "@/pages/HomePage/HomePage";
import PhotographyPage from "@/pages/PhotographyPage/PhotographyPage";
import Preloader from "@/components/Preloader";
import GrainOverlay from "@/components/GrainOverlay";
import './zitiguanjia-font.css';

/**
 * 页面入场动画状态 Context
 * - isEntering: 初始为 true，preloader 退场时切换为 false 触发主页面放大入场
 */
const PageEnterContext = createContext({ isEntering: true });

export function usePageEnter() {
  return useContext(PageEnterContext);
}

export default function App() {
  // true = 初始态（scale 0.92 + opacity 0），false = 入场完成（scale 1 + opacity 1）
  const [isEntering, setIsEntering] = useState(true);

  const handlePreloaderDone = useCallback(() => {
    // preloader 退出动画开始时，触发主页面放大入场
    setIsEntering(false);
  }, []);

  // SSR / 首次挂载安全：确保动画能正常触发
  useEffect(() => {
    // 兜底：如果 6s 还没触发（极端情况），强制入场
    const t = window.setTimeout(() => setIsEntering(false), 6000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <PageEnterContext.Provider value={{ isEntering }}>
      {/* 全局噪点覆盖层 */}
      <GrainOverlay />

      {/* 页面加载 Preloader */}
      <Preloader onExitStart={handlePreloaderDone} />

      {/* 主页面：放大入场动画 */}
      <div
        className={
          'page-enter-wrap ' +
          (isEntering ? 'is-entering' : 'has-entered')
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/photography" element={<PhotographyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </PageEnterContext.Provider>
  );
}
