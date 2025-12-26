import type { Meta, StoryObj } from '@storybook/react';
import { StatusLabel, statusStyles, StatusType } from './StatusLabel';

const statusOptions = Object.keys(statusStyles) as StatusType[];

const meta = {
  title: 'Controls/StatusLabel',
  component: StatusLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: statusOptions,
    },
  },
} satisfies Meta<typeof StatusLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'OK',
  },
};

export const AllStatuses: Story = {
  args: {
    status: 'OK',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {statusOptions.map((status) => (
        <StatusLabel key={status} status={status} />
      ))}
    </div>
  ),
};
