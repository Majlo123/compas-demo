import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';
import React from 'react';
import { register as registerUser } from '@/api/auth.actions';
import { isApiSuccess } from '@/api/shared.types';
import { verifyInviteToken } from '@/api/user-invite/userInvite.actions';

import CalendarIconLarge from '@/components/images/CalendarIconLarge';

import "../../App.scss";

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters')
    .regex(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/, 'Name should contain only letters, spaces, hyphens or apostrophes'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('invite');
      
      if (!token) {
        setIsValidToken(false);
        toast.error('Invalid or missing invite token');
        return;
      }

      const response = await verifyInviteToken(token);

      if (isApiSuccess(response) && response.content.email) {
        setValue('email', response.content.email);
        setIsValidToken(true);
      } else {
        setIsValidToken(false);
        const errorMsg = isApiSuccess(response) ? 'Invalid invite token' : (response.error?.message || 'Invalid invite token');
        toast.error(errorMsg);
      }
    };

    verifyToken();
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const inviteToken = searchParams.get('invite');
      const response = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        inviteToken: inviteToken || undefined,
      });

      if (isApiSuccess(response)) {
        toast.success('Registration successful! Please log in to continue.');
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

  // Show loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-darkGrey">Validating invite...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-xl text-center">
          <h2 className="font-inter font-bold text-h2 text-red mb-md">Invalid Invite</h2>
          <p className="text-darkGrey mb-lg">
            The invite link is invalid or has expired. Please contact your administrator for a new invite.
          </p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-xl">
        <div className="flex flex-col items-center mb-lg">
          <div className="mb-lg">
            <CalendarIconLarge />
          </div>
          <h2 className="font-inter font-extrabold text-h2 text-center text-gray-800">Complete Registration</h2>
          <p className="text-p2 text-darkGrey mt-2">You've been invited to join Vacation Tracker</p>
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
            disabled={true}
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

          <FormTextInput
            name="confirmPassword"
            control={control}
            errors={errors}
            required
            passwordToggle
            inputClassName="w-full"
            placeholder='Confirm Password'
            disabled={isSubmitting}
          />

          <Button type="submit" variant="primary" className="w-full mt-md" disabled={isSubmitting}>
            Complete Registration
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