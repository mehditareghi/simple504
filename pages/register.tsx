import axios from 'axios';
import React, { SyntheticEvent, useState } from 'react';
import { API_URL } from '@/utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const handleChange = (e: SyntheticEvent) => {
    setFormData({ ...formData, [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/registration/`, formData);
      // Handle successful registration here
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='p-8 bg-white rounded-xl shadow-md w-80'>
        <h2 className='H2'>Register</h2>
        <input
          type='text'
          name='username'
          required
          placeholder='Username'
          onChange={handleChange}
          className='field'
        />
        <input
          type='email'
          name='email'
          required
          placeholder='Email'
          onChange={handleChange}
          className='field'
        />
        <input
          type='password'
          name='password1'
          required
          placeholder='Password'
          onChange={handleChange}
          className='field'
        />
        <input
          type='password'
          name='password2'
          required
          placeholder='Confirm Password'
          onChange={handleChange}
          className='field'
        />
        <button
          type='submit'
          className='btn-prm'
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
