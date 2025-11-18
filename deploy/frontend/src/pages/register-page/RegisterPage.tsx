import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrimaryButton from '@/components/controls/button/PrimaryButton';
import FormTextInput from '@/components/controls/FormTextInput';
import React from 'react';
import { register as registerUser } from '@/api/auth/auth.actions';
import { isApiSuccess } from '@/api/shared.types';
import { useAuthStore } from '@/stores/useAuthStore';

import CalendarIconLarge from '@/components/images/CalendarIconLarge';

import "../../App.scss";

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters')
    .regex(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/, 'Name should contain only letters, spaces, hyphens or apostrophes'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (isApiSuccess(response)) {
        toast.success('Registration successful! Welcome aboard!');
        
        // Auto-login: store token and update auth state
        login(response.content.token);
        
        // Redirect to home page
        navigate('/home');
      } else {
        toast.error(response.error?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded  -xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-6">
            <CalendarIconLarge />
          </div>
          <h2 className="font-inter font-extrabold text-2xl leading-7 text-center text-gray-800">Vacation Tracker</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormTextInput
            name="fullName"
            control={control}
            errors={errors}
            required
            type="text"
            inputClassName="w-full"
            placeholder="Full Name"
          />

          <FormTextInput
            name="email"
            control={control}
            errors={errors}
            required
            type="email"
            inputClassName="w-full"
            placeholder='Email'
          />

          <FormTextInput
            name="password"
            control={control}
            errors={errors}
            required
            passwordToggle
            inputClassName="w-full"
            placeholder='Password'
          />

          <PrimaryButton type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </PrimaryButton>

          <div className="text-center text-p2 text-darkGrey mt-3">
            Already have an account?{' '}
            <a href="/login" className="text-primary underline)">
              Log In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;