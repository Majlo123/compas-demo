import type { Meta, StoryObj } from '@storybook/react';
import { Counter } from './Counter';
import { useState } from 'react';

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

const CounterWithState = (args: any) => {
    const [value, setValue] = useState(args.value || 4);
    return (
        <Counter
            {...args}
            value={value}
            onIncrement={() => setValue(value + 1)}
            onDecrement={() => setValue(value - 1)}
            onChange={(newValue) => setValue(newValue)}
        />
    );
};

export const Default: Story = {
    render: (args) => <CounterWithState {...args} />,
    args: {
        value: 4,
        onIncrement: () => { },
        onDecrement: () => { },
        onChange: () => { },
    },
};

export const MinMax: Story = {
    render: (args) => <CounterWithState {...args} />,
    args: {
        value: 5,
        min: 0,
        max: 10,
        onIncrement: () => { },
        onDecrement: () => { },
        onChange: () => { },
    },
};
