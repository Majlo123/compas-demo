import { useForm } from 'react-hook-form';
import PrimaryButton from '@/components/controls/button/PrimaryButton';
import FormTextInput from '@/components/controls/FormTextInput';
import React from 'react';

import CalendarIconLarge from '@/components/images/CalendarIconLarge';

import "../../App.scss";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
};

const RegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log('Register submit:', data);
    reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

          <PrimaryButton type="submit" className="w-full mt-2">
            Register
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