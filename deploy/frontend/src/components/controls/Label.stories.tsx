import type { Meta, StoryObj } from '@storybook/react';

import { Label, CommodityCategory, categoryStyles } from './Label';

const categoryOptions = Object.keys(categoryStyles) as CommodityCategory[];

const meta = {
  title: 'Controls/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: categoryOptions,
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: 'FRUIT AND VEGETABLES',
  },
};

export const AllCategories: Story = {
  args: {
    category: 'FRUIT AND VEGETABLES',
  },
  render: () => (
    <div className="flex flex-wrap gap-4 max-w-2xl">
      {categoryOptions.map((category) => (
        <Label key={category} category={category}>
          {category}
        </Label>
      ))}
    </div>
  ),
};
