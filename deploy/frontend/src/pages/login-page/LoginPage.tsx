import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '@/components/controls/button/PrimaryButton';
import FormTextInput from '@/components/controls/FormTextInput';
import CalendarIconLarge from '@/components/images/CalendarIconLarge';
import { login } from '@/api/auth/auth.actions';
import { setToLocalStorage } from '@/services/local.storage';
import { isApiSuccess } from '@/api/shared.types';

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
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });

  const onSubmit = async (values: LoginFormValues) => {
    const response = await login({
      email: values.email,
      password: values.password,
    });

    if (isApiSuccess(response)) {
      setToLocalStorage('token', response.content.token);
      setToLocalStorage('user', JSON.stringify(response.content.user));
      navigate('/home');
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