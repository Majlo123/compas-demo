import { FC } from 'react';

import IconCircleInfo from '@/components/images/IconCircleInfo';
import classNameBuilder from '@/utils/classNameBuilder';

type FormErrorSectionProps = {
  className?: string;
  error?: string;
};
const FormErrorSection: FC<FormErrorSectionProps> = ({ className, error }) => {
  if (!error) {
    return null;
  }
  return (
    <section
      className={classNameBuilder(
        'form-error-section',
        className,
        'flex flex-row items-center justify-start p-[10px]',
        'border-red border rounded-[4px]'
      )}
    >
      <IconCircleInfo className="w-8 h-8 mr-2 stroke-red" />
      <span className="text-p1 text-red">{error}</span>
    </section>
  );
};

export default FormErrorSection;
