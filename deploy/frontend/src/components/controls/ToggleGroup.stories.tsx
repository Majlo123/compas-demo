import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

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

const categories = [
  'CRISPS AND SNACKS',
  'ALCOHOLIC BEVERAGE',
  'FRUIT AND VEGETABLES',
  'CLEANING MATERIALS',
  'GROCERIES AMBIENT',
  'NON FOOD RETAIL',
  'COLD BEVERAGES',
  'BREAD PRODUCTS',
  'DISPOSABLES',
  'FISH AND SEAFOOD',
  'SWEET PRODUCTS',
];

export const Categories: Story = {
  render: () => (
    <ToggleGroup
      type="single"
      variant="outline"
      className="flex flex-wrap justify-start gap-2 max-w-md"
      defaultValue="CRISPS AND SNACKS"
    >
      {categories.map((category) => (
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
