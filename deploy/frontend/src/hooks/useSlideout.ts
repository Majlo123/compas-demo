import { useState } from 'react';

import useOutsideClick from '@/hooks/useOutsideClick';

const useSlideout = (): {
  isSlideoutOpen: boolean;
  openSlideout: (node: React.ReactNode) => void;
  closeSlideout: () => void;
  slideoutRef: React.MutableRefObject<HTMLDivElement | null>;
  content: React.ReactNode;
} => {
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const closeSlideout = (): void => {
    setIsSlideoutOpen(false);
    setContent(null);
  };

  const openSlideout = (node: React.ReactNode): void => {
    setContent(node);
    setIsSlideoutOpen(true);
  };

  const slideoutRef = useOutsideClick<HTMLDivElement>(() => {
    closeSlideout();
  });

  return {
    isSlideoutOpen,
    openSlideout,
    closeSlideout,
    slideoutRef,
    content,
  };
};

export default useSlideout;
