import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/controls/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/controls/Dialog';

const meta = {
  title: 'Controls/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Level</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <DialogDescription>
            This is a basic dialog with the yellow header style.
          </DialogDescription>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Create Level</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Level</DialogTitle>
        </DialogHeader>
        <div className="p-6 grid gap-4">
          <div className="grid gap-2">
            <input
              id="name"
              type="text"
              placeholder="Warning Level Name *"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Warning Level Name"
            />
          </div>
          <div className="grid gap-2">
            <textarea
              id="description"
              placeholder="Description *"
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Description"
            />
          </div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-0 sm:justify-center flex-col sm:flex-col gap-3">
          <Button
            variant="primary"
            className="w-full bg-gray-400 hover:bg-gray-500 text-white border-none"
          >
            Create Par Level
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full rounded-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
