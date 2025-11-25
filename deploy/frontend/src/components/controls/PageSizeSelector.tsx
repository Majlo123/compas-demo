import { FC } from 'react';
import Select from '@/components/controls/Select';
import { SelectOption } from '@/components/controls/Select';
import { PAGE_SIZES } from '@/types/query/QueryPagination';
import classNameBuilder from '@/utils/classNameBuilder';

interface PageSizeSelectorProps {
  className?: string;
  pageSize: number;
  onChange: (pageSize: number) => void;
}

const PageSizeSelector: FC<PageSizeSelectorProps> = ({ className, pageSize, onChange }) => {
  const options: SelectOption[] = PAGE_SIZES.map(size => ({
    label: size.toString(),
    value: size.toString(),
  }));

  const selectedOption: SelectOption = {
    label: pageSize.toString(),
    value: pageSize.toString(),
  };

  const handleChange = (option: SelectOption | null) => {
    const newSize = Number(option?.value || 20);
    onChange(newSize);
  };

  return (
    <div className={classNameBuilder(className, 'flex items-center gap-2')}>
      <span className="text-darkGrey text-p2">Items per page:</span>
      <Select
        className="text-p2 w-button-sm"
        options={options}
        value={selectedOption}
        onChange={handleChange}
      />
    </div>
  );
};

export default PageSizeSelector;
