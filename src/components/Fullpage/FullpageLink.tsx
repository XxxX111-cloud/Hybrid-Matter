import { forwardRef } from 'react';
import { useFullpage } from './FullpageProvider';
import { UniversalLink } from '@lark-apaas/client-toolkit-lite';

const ANCHOR_TO_INDEX: Record<string, number> = {
  '#hero': 0,
  '#about': 1,
  '#works': 2,
  '#awards': 3,
  '#skills': 4,
  '#contact': 5,
  '#top': 0,
};

interface FullpageLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

/**
 * 锚点链接的 fullpage 适配版：点击时不做默认滚动，改为调用 goTo 翻页。
 * 渲染成 <a> 标签以保持语义，拦截点击事件。
 */
const FullpageLink = forwardRef<HTMLAnchorElement, FullpageLinkProps>(
  function FullpageLink({ to, children, className, onClick, href, ...rest }, ref) {
    const { goTo } = useFullpage();
    const target = to || href || '';

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick?.();
      const idx = ANCHOR_TO_INDEX[target];
      if (idx !== undefined) {
        goTo(idx);
      }
    };

    return (
      <UniversalLink ref={ref} to={target} className={className} onClick={handleClick} {...rest}>
        {children}
      </UniversalLink>
    );
  },
);

export default FullpageLink;

export function anchorToIndex(to: string): number | undefined {
  return ANCHOR_TO_INDEX[to];
}
