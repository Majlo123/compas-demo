import { commodityGroups } from '@/types/commodityGroups';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/controls/ToggleGroup';

const meta = {
  title: 'Controls/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Categories: Story = {
  args: {
    type: 'single',
    variant: 'outline',
    className: 'flex flex-wrap justify-start gap-2 max-w-md',
    defaultValue: 'CRISPS AND SNACKS',
  },
  render: () => (
    <ToggleGroup
      type="single"
      variant="outline"
      className="flex flex-wrap justify-start gap-2 max-w-md"
      defaultValue="CRISPS AND SNACKS"
    >
      {commodityGroups.map((category) => (
        <ToggleGroupItem
          key={category}
          value={category}
          aria-label={`Toggle ${category}`}
        >
          {category}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
};
