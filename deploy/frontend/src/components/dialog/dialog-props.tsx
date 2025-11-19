import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface DialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const CustomDialog: React.FC<DialogProps> = ({
  title,
  description,
  isOpen,
  onOpenChange,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
        <Dialog.Title className="text-lg font-bold mb-2">{title}</Dialog.Title>
        {description && <Dialog.Description className="text-sm text-gray-500 mb-4">{description}</Dialog.Description>}
        {children}
        <Dialog.Close asChild>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CustomDialog;