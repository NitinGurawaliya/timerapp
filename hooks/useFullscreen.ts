import { useState, useEffect } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.warn('Error attempting to enable fullscreen:', err));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn('Error attempting to exit fullscreen:', err));
    }
  };

  useEffect(() => {
    const fullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', fullscreenChange);
    return () => document.removeEventListener('fullscreenchange', fullscreenChange);
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen };
}

