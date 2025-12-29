import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Controls/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

const SearchInputWithState = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[600px]">
      <div />
      <SearchInput
        placeholder="Search Products, Codes or Categories"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={(val) => alert(`Searching for: ${val}`)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SearchInputWithState />,
};
