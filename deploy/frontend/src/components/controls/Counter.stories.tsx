import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Counter } from '@/components/controls/Counter';

const meta = {
  title: 'Controls/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

const CounterWithState = ({
  value: initialValue,
  ...args
}: any): JSX.Element => {
  const [value, setValue] = useState(initialValue || 4);
  return (
    <Counter
      {...args}
      value={value}
      onIncrement={(): void => setValue(value + 1)}
      onDecrement={(): void => setValue(value - 1)}
      onChange={(newValue): void => setValue(newValue)}
    />
  );
};

export const Default: Story = {
  render: (args) => <CounterWithState {...args} />,
  args: {
    value: 4,
    onIncrement: () => {},
    onDecrement: () => {},
    onChange: () => {},
  },
};

export const MinMax: Story = {
  render: (args) => <CounterWithState {...args} />,
  args: {
    value: 5,
    min: 0,
    max: 10,
    onIncrement: () => {},
    onDecrement: () => {},
    onChange: () => {},
  },
};
