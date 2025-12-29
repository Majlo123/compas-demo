import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { SearchInput } from '@/components/controls/SearchInput';

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

const SearchInputWithState = (): JSX.Element => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[600px]">
      <div />
      <SearchInput
        placeholder="Search Products, Codes or Categories"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={(val) => {
          // eslint-disable-next-line no-console
          console.log(`Searching for: ${val}`);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SearchInputWithState />,
};
