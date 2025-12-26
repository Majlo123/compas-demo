import { useState } from 'react';
import {
  warningLevelApi,
  type WarningLevel,
  type CreateWarningLevelInput,
} from '@/api/warningLevel.api';
import { Button } from '@/components/controls/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/controls/Dialog';

interface CreateWarningLevelDialogProps {
  onSuccess: (newLevel: WarningLevel) => void;
}

export const CreateWarningLevelDialog = ({
  onSuccess,
}: CreateWarningLevelDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateWarningLevelInput>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateWarningLevel = async () => {
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setCreateError(null);

    try {
      const newLevel = await warningLevelApi.create({
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
      });

      // Reset form and close dialog
      setFormData({ name: '', description: '' });
      setIsDialogOpen(false);

      onSuccess(newLevel);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Failed to create warning level'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim().length > 0 && formData.description?.trim().length > 0;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="mx-auto flex items-center justify-center w-[280px] rounded-full font-black text-sm text-black tracking-wide py-2.5 mb-4"
          onClick={() => {
            setFormData({ name: '', description: '' });
            setCreateError(null);
          }}
        >
          Create Warning Level
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[320px] p-0 gap-0 !rounded-3xl overflow-hidden border-none">
        <DialogHeader className="bg-primary !px-6 !py-4 !rounded-t-none">
          <DialogTitle className="text-base font-bold text-black text-left">
            Create New Level
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 grid gap-3">
          <h3 className="text-xs font-bold text-black">
            Enter Warning Level Details
          </h3>
          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
              {createError}
            </div>
          )}
          <div className="grid gap-1.5">
            <input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Warning Level Name *"
              className="flex h-8 w-full rounded-md border border-gray-500 bg-white px-2 py-1 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-1.5">
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description *"
              className="flex min-h-[80px] w-full rounded-md border border-gray-500 bg-white px-2 py-1 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <br></br>
        <DialogFooter className="!px-4 !pb-6 !pt-2 !flex !flex-col !items-center !justify-center !space-x-0 gap-3">
          <Button
            variant="black"
            className="w-[200px] border-none h-9 text-xs font-bold rounded-full"
            onClick={handleCreateWarningLevel}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Par Level'}
          </Button>
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="w-[200px] rounded-full h-9 text-xs font-bold border-pureBlack text-pureBlack hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
