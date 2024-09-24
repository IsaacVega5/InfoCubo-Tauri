import { useEffect } from 'react';

export const useOnResizeObserver = ({id, onResize}) => {
  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    onResize(width, height);
  });

  useEffect(() => {
    const imgCont = document.getElementById(id);
    resizeObserver.observe(imgCont);
    return () => {
      resizeObserver.unobserve(imgCont);
    };
  }, []);
};