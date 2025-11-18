import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '@/components/controls/button/PrimaryButton';
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
    .min(6, 'Password must be at least 6 characters'),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg py-12 px-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <CalendarIconLarge />
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Vacation Tracker</h1>
        
        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <FormTextInput
            name="email"
            control={control}
            errors={formState.errors}
            type="email"
            placeholder="Email"
            required
          />

          <FormTextInput
            name="password"
            control={control}
            errors={formState.errors}
            type="password"
            placeholder="Password"
            passwordToggle
            required
          />

          <PrimaryButton type="submit" className="w-full mt-2">
            Log in
          </PrimaryButton>
        </form>
        
        <div className="mt-6 text-center text-m text-gray-500">
          Don't have an account? <a href="/register" className="text-primary hover:text-primary-hover no-underline font-medium cursor-pointer hover:underline transition-colors">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;