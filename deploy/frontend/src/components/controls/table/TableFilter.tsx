import { FC, useState } from 'react';

import PrimaryButton from '@/components/controls/button/PrimaryButton';
import SecondaryButton from '@/components/controls/button/SecondaryButton.tsx';
import Select, { SelectOption } from '@/components/controls/Select';
import TextInput from '@/components/controls/TextInput';
import useFilter from '@/hooks/useFilter';
import usePagination from '@/hooks/usePagination';
import { FilterOperator } from '@/types/query/QueryFilters';

type FilterOption = {
  filterKey: string;
  label: string;
  availableOperators: FilterOperator[];
};

type TableFilterProps = {
  className?: string;
  filterOptions: FilterOption[];
};

const TableFilter: FC<TableFilterProps> = ({ className, filterOptions }) => {
  const { setPage } = usePagination();
  const [filter, setFilter] = useState<FilterOption | null>(null);
  const [operator, setOperator] = useState<FilterOperator | null>(null);
  const [value, setValue] = useState<string>('');

  const {
    filters: activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
  } = useFilter();

  const keyOptionMap = new Map(
    filterOptions.map((opt) => [opt.filterKey, opt])
  );

  const handleSetFilter = (selectValue: SelectOption): void => {
    const selectedFilterKey = selectValue.value;
    const selectedFilter = keyOptionMap.get(selectedFilterKey) || null;
    setFilter(selectedFilter);

    if (
      !selectedFilter ||
      !operator ||
      !selectedFilter.availableOperators.includes(operator)
    ) {
      setOperator(null);
    }
  };

  const handleSetOperator = (selectedValue: SelectOption): void => {
    const selectedOperator = selectedValue.value as FilterOperator;
    if (filter?.availableOperators.includes(selectedOperator)) {
      setOperator(selectedOperator);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const clearSelection = (): void => {
    setFilter(null);
    setOperator(null);
    setValue('');
  };

  const handleAddFilter = (): void => {
    if (filter && operator && value) {
      addFilter(filter.filterKey, operator, value);
      setPage(1);
      clearSelection();
    }
  };

  const handleRemoveFilter = (filterKey: string): void => {
    removeFilter(filterKey);
    setPage(1);
  };

  const handleClearFilters = (): void => {
    clearFilters();
    setPage(1);
  };

  return (
    <div className={className}>
      <section>
        <section className="flex flex-col mb-5">
          <div className="flex flex-row justify-start items-end mb-2 gap-5">
            <div className="flex flex-row gap-2 items-center">
              <Select
                label="Select filter"
                id="table-filter-filter-select"
                value={
                  filter && { value: filter.filterKey, label: filter.label }
                }
                options={filterOptions.map((filterOption) => {
                  return {
                    value: filterOption.filterKey,
                    label: filterOption.label,
                  };
                })}
                onChange={handleSetFilter}
                placeholder="Select filter"
              />
              <Select
                id="table-filter-operator-select"
                label="Select operator"
                value={operator && { value: operator, label: operator }}
                options={
                  filter?.availableOperators.map((op) => ({
                    value: op,
                    label: op,
                  })) || []
                }
                placeholder="Select operator"
                onChange={handleSetOperator}
              />
              <TextInput
                id="table-filter-value-input"
                className="text-darkGrey"
                label="Value"
                value={value}
                onChange={handleValueChange}
                placeholder="Value"
              />
            </div>

            <PrimaryButton onClick={handleAddFilter}>Add</PrimaryButton>
          </div>
        </section>

        <section className="flex flex-col mb-5">
          <div className="mb-4">Active Filters</div>
          <div className="flex flex-wrap justify-start items-center mb-2">
            {activeFilters.map((activeFilter) => {
              const option = keyOptionMap.get(activeFilter.filterKey);
              if (!option) return null;

              return (
                <div
                  key={activeFilter.filterKey}
                  className="border border-grey95 rounded px-2 py-1 mr-2 flex flex-row items-center gap-2"
                >
                  <span className="text-darkGrey">
                    {option.label} {activeFilter.operator} {activeFilter.value}
                  </span>
                  <button
                    onClick={() => handleRemoveFilter(activeFilter.filterKey)}
                    className="text-red font-bold"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex w-full justify-center">
          <SecondaryButton onClick={handleClearFilters} className="w-[200px]">
            Clear All
          </SecondaryButton>
        </section>
      </section>
    </div>
  );
};

export default TableFilter;

// TODO - We need design for filtering
