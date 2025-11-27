import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface DialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  classContent?: string;
  classTitle?: string;
}

const CustomDialog: React.FC<DialogProps> = ({
  title,
  description,
  isOpen,
  onOpenChange,
  children,
  classContent,
  classTitle,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-lg rounded-md shadow-lg w-1/3 z-50 ${classContent}`}>
        <Dialog.Title className={`text-h2 font-bold mb-sm ${classTitle}`}>{title}</Dialog.Title>
        {/* Always render a description for accessibility; if none provided, fall back to a visually-hidden description using the title */}
        <Dialog.Description className={description ? 'text-p2 text-gray-500 mb-lg' : 'sr-only'}>
          {description || title}
        </Dialog.Description>
        {children}
        <Dialog.Close asChild>
          <button className="absolute top-2 right-2  text-gray-500 hover:text-gray-700 text-h2">✕</button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CustomDialog;