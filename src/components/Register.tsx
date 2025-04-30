import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { saveUserDataToFirestore } from '../utils/methods'; 
import './CSS/Register.css';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
});

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

function RegisterUserForm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await saveUserDataToFirestore(data); 
    if (result.success) {
      setStatus('✅ User registered successfully!');
      reset();
      navigate('/form/login');
    } else {
      setStatus(result.message || '⚠️ Error saving user data to Firebase.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Left Side */}
        <div className="left-side">
          <h2>Welcome Back</h2>
          <p>Already have an account? Sign in here!</p>
          <button onClick={() => navigate('/login')} className="login-button">
            LOGIN
          </button>
        </div>

        {/* Right Side - Register Form */}
        <div className="right-side">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <div className="input-group">
              <input
                type="text"
                {...register('name')}
                placeholder="Full Name"
                className="input-field"
              />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>

            <div className="input-group">
              <input
                type="email"
                {...register('email')}
                placeholder="Email Address"
                className="input-field"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="input-field"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm Password"
                className="input-field"
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                {...register('phone')}
                placeholder="Phone Number"
                className="input-field"
              />
              {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>

            <div className="input-group">
              <textarea
                {...register('address')}
                rows={2}
                placeholder="Address"
                className="input-field"
              />
              {errors.address && <p className="error-message">{errors.address.message}</p>}
            </div>

            {status && <p className="status-message">{status}</p>}

            <button type="submit" className="submit-button">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterUserForm;
