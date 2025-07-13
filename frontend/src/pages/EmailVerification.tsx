import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


const verificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema)
  });

  const watchedCode = watch('code');

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (watchedCode && watchedCode.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [watchedCode]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: VerificationFormData) => {
    if (!email) {
      toast.error('Email not found. Please try registering again.');
      navigate('/signup');
      return;
    }

    try {
      const response = await axios.post('/api/auth/verify-email', {
        email: email,
        code: data.code
      });

      const { token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.detail || 'Verification failed';
      toast.error(errorMessage);
      
      // Clear the code field on error
      setValue('code', '');
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email not found. Please try registering again.');
      navigate('/signup');
      return;
    }

    setIsResending(true);
    try {
      await axios.post('/api/auth/resend-verification', { email });
      toast.success('Verification code sent successfully!');
      setCountdown(60); // 60 second cooldown
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.detail || 'Failed to resend code';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Email Not Found</h2>
            <p className="mt-2 text-gray-600">Please try registering again.</p>
            <Link
              to="/signup"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <div className="relative">
              <input
                {...register('code')}
                type="text"
                maxLength={6}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
            {errors.code && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || !watchedCode || watchedCode.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                {countdown > 0 
                  ? `Resend in ${countdown}s` 
                  : isResending 
                    ? 'Sending...' 
                    : "Didn't receive the code? Resend"
                }
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification; 