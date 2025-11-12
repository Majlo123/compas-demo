import { useEffect, useRef, useState } from 'react';

type UseThrottledSubmissionArgs = {
  isSubmitting: boolean;
  delay?: number;
};

function useThrottledSubmission({
  isSubmitting,
  delay = 2000,
}: UseThrottledSubmissionArgs): boolean {
  const [isGoodToGoAgain, setIsGoodToGoAgain] = useState(true);
  const prevIsSubmitting = useRef(isSubmitting);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (prevIsSubmitting.current === true && isSubmitting === false) {
      setIsGoodToGoAgain(false);
      timer = setTimeout(() => setIsGoodToGoAgain(true), delay);
    }

    prevIsSubmitting.current = isSubmitting;

    return (): void => {
      if (timer) clearTimeout(timer);
    };
  }, [isSubmitting, delay]);

  return isGoodToGoAgain;
}

export default useThrottledSubmission;
