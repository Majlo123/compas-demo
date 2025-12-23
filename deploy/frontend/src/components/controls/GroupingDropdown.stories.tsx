import type { Meta, StoryObj } from '@storybook/react';
import { GroupingDropdown, GroupingOption } from './GroupingDropdown';
import { useState } from 'react';

const meta: Meta<typeof GroupingDropdown> = {
  title: 'Controls/GroupingDropdown',
  component: GroupingDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroupingDropdown>;

const options: GroupingOption[] = [
  { id: 'no-grouping', label: 'No Grouping' },
  { id: 'threshold', label: 'Group by Threshold' },
  { id: 'commodity-group', label: 'Group by Commodity Group' },
];

const GroupingDropdownWithState = () => {
  const [selected, setSelected] = useState('no-grouping');

  return (
    <div className="w-64">
        <GroupingDropdown
            options={options}
            selectedOptionId={selected}
            onSelect={(opt) => setSelected(opt.id)}
        />
    </div>
  );
};

export const Default: Story = {
  render: () => <GroupingDropdownWithState />,
};
