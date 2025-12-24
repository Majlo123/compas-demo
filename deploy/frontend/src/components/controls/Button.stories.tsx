import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
    title: 'Controls/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary', 'black', 'round', 'small'] },
        disabled: { control: 'boolean' },
        icon: { control: 'select', options: ['search', 'filter', 'plus', 'minus', undefined] },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Black: Story = {
    args: {
        variant: 'black',
        children: 'Black Button',
    },
};

export const Round: Story = {
    args: {
        variant: 'round',
        icon: 'search',
    },
};

export const WithFilterIcon: Story = {
    args: {
        variant: 'secondary',
        children: 'Filter',
        icon: 'filter',
    },
};
