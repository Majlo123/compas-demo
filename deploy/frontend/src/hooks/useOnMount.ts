import { useEffect, useRef } from 'react';

type MountCallback = () => void;

const useOnMount = (callback: MountCallback): void => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true;
      callback();
    }
  }, []);
};

export default useOnMount;
