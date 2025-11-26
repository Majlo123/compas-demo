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
});

type TeamForm = z.infer<typeof teamFormSchema>;

type DialogTeamFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { name: string }) => Promise<void>;
};

const DialogTeamForm: FC<DialogTeamFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TeamForm>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  const onSubmitHandler = async (data: TeamForm) => {
    try {
      if (onSubmit) {
        await onSubmit({ name: data.name });
      } else {
        toast.success('Team created successfully!');
      }
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create team');
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
        <div className="mb-xl">
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
