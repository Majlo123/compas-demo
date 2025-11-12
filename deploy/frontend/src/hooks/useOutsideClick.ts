import { useEffect, useRef } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

const useOutsideClick = <T extends HTMLElement>(
  handler: Handler
): React.MutableRefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return (): void => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};

export default useOutsideClick;
