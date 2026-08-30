import { createContext, useContext, useMemo, useState, useCallback } from 'react';

export type TransitionDirection = 'up' | 'down' | 'left' | 'right' | 'center';

interface PageTransitionContextValue {
  /** 当前页在转场中的相位：'enter'（入场） / 'exit'（退场） / 'idle'（静止） */
  phase: 'enter' | 'exit' | 'idle';
  /** 转场方向（位移方向） */
  direction: TransitionDirection;
  /** 翻页 key，每次翻页递增，用于重启动画 */
  turnKey: number;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  // 在 Provider 之外（非 fullpage 环境）使用时返回默认值，保证组件可独立渲染
  return (
    ctx ?? {
      phase: 'enter' as const,
      direction: 'up' as TransitionDirection,
      turnKey: 0,
    }
  );
}

interface PageTransitionProviderProps {
  direction: TransitionDirection;
  /** 是否进入中（true = 新页入场；false = 旧页退场） */
  entering: boolean;
  turnKey: number;
  children: React.ReactNode;
}

export function PageTransitionProvider({
  direction,
  entering,
  turnKey,
  children,
}: PageTransitionProviderProps) {
  const value = useMemo<PageTransitionContextValue>(
    () => ({
      phase: entering ? 'enter' : 'exit',
      direction,
      turnKey,
    }),
    [direction, entering, turnKey],
  );

  return (
    <PageTransitionContext.Provider value={value}>{children}</PageTransitionContext.Provider>
  );
}

// 方便外部使用的工具：把 direction 转成 x/y 偏移量
export function directionToOffset(
  direction: TransitionDirection,
  magnitude: number,
): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: -magnitude };
    case 'down':
      return { x: 0, y: magnitude };
    case 'left':
      return { x: -magnitude, y: 0 };
    case 'right':
      return { x: magnitude, y: 0 };
    case 'center':
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * 把方向反相（进入 ↔ 退出）
 * 当某元素"退场方向"和整页转场方向相反时用
 */
export function reverseDirection(d: TransitionDirection): TransitionDirection {
  switch (d) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
    case 'center': return 'center';
  }
}
