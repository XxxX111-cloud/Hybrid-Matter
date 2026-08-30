import { useEffect, useContext, useRef } from 'react';
import { useWorksDialog } from './WorksDialogContext';
import { FullpageContext } from '../Fullpage/FullpageProvider';
import PreppedFoodDialog from './PreppedFoodDialog';
import DtBusinessDialog from './DtBusinessDialog';
import ThroatCivilizationDialog from './ThroatCivilizationDialog';
import GflArDimensionDialog from './GflArDimensionDialog';
import YiTaoDialog from './YiTaoDialog';

/**
 * 放在 FullpageProvider 内部（chrome 层），用于在弹窗打开时锁定翻页
 */
export function FullpageLockBridge() {
  const { openWork } = useWorksDialog();
  const fullpageCtx = useContext(FullpageContext);
  const registerLock = fullpageCtx?.registerLock;
  const prevLockRef = useRef(false);

  useEffect(() => {
    const locked = !!openWork;
    if (locked !== prevLockRef.current) {
      registerLock?.('works-dialog', locked);
      prevLockRef.current = locked;
    }
    return () => {
      if (prevLockRef.current) {
        registerLock?.('works-dialog', false);
        prevLockRef.current = false;
      }
    };
  }, [openWork, registerLock]);

  return null;
}

// 内部组件：监听弹窗状态，锁定 body 滚动
function BodyLockController() {
  const { openWork } = useWorksDialog();

  useEffect(() => {
    if (openWork) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [openWork]);

  return null;
}

export function WorksDialogLayer() {
  return (
    <>
      <BodyLockController />
      <PreppedFoodDialog />
      <DtBusinessDialog />
      <ThroatCivilizationDialog />
      <GflArDimensionDialog />
      <YiTaoDialog />
    </>
  );
}

export { WorksDialogProvider } from './WorksDialogContext';
