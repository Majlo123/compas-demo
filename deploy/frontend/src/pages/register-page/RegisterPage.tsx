import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';
import React from 'react';
import { register as registerUser } from '@/api/auth/auth.actions';
import { isApiSuccess } from '@/api/shared.types';

import CalendarIconLarge from '@/components/images/CalendarIconLarge';

import "../../App.scss";

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters')
    .regex(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/, 'Name should contain only letters, spaces, hyphens or apostrophes'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (isApiSuccess(response)) {
        toast.success('Registration successful! Please log in to continue.');
        // Reset the form and redirect to login page
        reset();
        navigate('/login');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-xl">
        <div className="flex flex-col items-center mb-lg">
          <div className="mb-lg">
            <CalendarIconLarge />
          </div>
          <h2 className="font-inter font-extrabold text-h2 text-center text-gray-800">Vacation Tracker</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
          <FormTextInput
            name="fullName"
            control={control}
            errors={errors}
            required
            type="text"
            inputClassName="w-full"
            placeholder="Full Name"
            disabled={isSubmitting}
          />

          <FormTextInput
            name="email"
            control={control}
            errors={errors}
            required
            type="email"
            inputClassName="w-full"
            placeholder='Email'
            disabled={isSubmitting}
          />

          <FormTextInput
            name="password"
            control={control}
            errors={errors}
            required
            passwordToggle
            inputClassName="w-full"
            placeholder='Password'
            disabled={isSubmitting}
          />

          <Button type="submit" variant="primary" className="w-full mt-md" disabled={isSubmitting}>
            Register
          </Button>

          
        </form>

        <div className="text-center text-p2 text-darkGrey mt-md">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Log In
            </a>
          </div>
      </div>
    </div>
  );
};

export default RegisterPage;