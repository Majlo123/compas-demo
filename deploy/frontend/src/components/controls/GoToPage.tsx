import { FC, useState } from 'react';

import PrimaryButton from '@/components/controls/button/PrimaryButton';
import usePagination from '@/hooks/usePagination';
import classNameBuilder from '@/utils/classNameBuilder';

interface PaginationProps {
  className?: string;
  total: number;
  onChange?: (page: number) => void;
}

/**
 * ⚠️ The `onChange` param must be stable to avoid unnecessary re-renders.
 * Consider memoizing it with `useCallback`.
 */
const GoToPage: FC<PaginationProps> = ({ className, total, onChange }) => {
  const { setPage } = usePagination(onChange);
  const [inputValue, setInputValue] = useState<number | string>(1);

  const handleGoToPage = (newPage: number | string): void => {
    const newPageNumber = Number(newPage);
    if (Number.isNaN(newPageNumber)) {
      return;
    }
    if (newPageNumber > total) {
      const lastPage = Math.max(total, 1);
      setInputValue(lastPage);
      setPage(lastPage);
      return;
    }

    setPage(newPageNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === '') {
      setInputValue('');
      return;
    }
    const value = Number(e.target.value);
    setInputValue(value);
  };

  return (
    <div
      className={classNameBuilder(
        className,
        'flex items-center justify-center'
      )}
    >
      <span className="text-darkGrey text-h4 mr-4">Go to Page</span>
      <input
        name="goto-page"
        type="number"
        min={1}
        max={total}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGoToPage(inputValue);
          }
        }}
        className={classNameBuilder(
          'arrowless-input',
          'w-[70px] h-[32px] mr-4',
          'bg-transparent rounded-lg border-unknownColor !border-[1px] text-darkGrey',
          'text-h4 text-left',
          'focus:outline-none focus:ring-transparent focus:!border-blue'
        )}
      />
      <PrimaryButton
        className="!h-8"
        onClick={() => handleGoToPage(inputValue)}
      >
        Go
      </PrimaryButton>
    </div>
  );
};

export default GoToPage;
