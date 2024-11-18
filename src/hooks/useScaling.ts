import { useState, useEffect } from 'react';

export function useScaling() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const container = document.querySelector('.max-w-6xl');
      if (!container) return;

      const viewportWidth = window.innerWidth;
      const contentWidth = container.scrollWidth;
      
      // Add padding to account for mobile screens
      const targetWidth = Math.min(contentWidth, 1024);
      const padding = 32; // 16px padding on each side
      
      const newScale = Math.min((viewportWidth - padding) / targetWidth, 1);
      setScale(newScale);
    };

    // Initial update
    setTimeout(updateScale, 0);

    // Update on resize and orientation change
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  return scale;
}