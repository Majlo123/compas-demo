import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';
import CalendarIconLarge from '@/components/images/CalendarIconLarge';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        toast.success('Login successful! Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-6">
            <CalendarIconLarge />
          </div>
          <h2 className="font-inter font-extrabold text-2xl leading-7 text-center text-gray-800">Vacation Tracker</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <FormTextInput
            name="email"
            control={control}
            errors={formState.errors}
            type="email"
            inputClassName="w-full"
            placeholder="Email"
            required
          />

          <FormTextInput
            name="password"
            control={control}
            errors={formState.errors}
            type="password"
            inputClassName="w-full"
            placeholder="Password"
            passwordToggle
            required
          />

          <Button type="submit" className="w-full mt-2">
            Log in
          </Button>

        </form>
        <div className="text-center text-p2 text-darkGrey mt-3">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;