import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';

const teamFormSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
});

type TeamForm = z.infer<typeof teamFormSchema>;

type DialogTeamFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { name: string; description?: string }) => Promise<void>;
};

const DialogTeamForm: FC<DialogTeamFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TeamForm>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: '', description: '' },
    mode: 'onChange',
  });

  const onSubmitHandler = async (data: TeamForm) => {
    if (onSubmit) {
      // If a parent onSubmit is provided, delegate error handling to it
      try {
        await onSubmit({ name: data.name, description: data.description });
        reset();
        onOpenChange(false);
      } catch (err) {
        // Error handling is done in the parent component
      }
    } else {
      try {
        toast.success('Team created successfully!');
        reset();
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to create team');
      }
    }
  };

  return (
    <CustomDialog
      title="New Team"
      description="Enter a name for the new team."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          <FormTextInput
            name="name"
            control={control}
            errors={errors}
            type="text"
            inputClassName="w-full"
            placeholder="Enter team name"
            label="Team Name"
            required
          />
        </div>
        <div>
          <FormTextInput
            name="description"
            control={control}
            errors={errors}
            type="text"
            inputClassName="w-full"
            placeholder="Enter team description"
            label="Team Description"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Team'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogTeamForm;
