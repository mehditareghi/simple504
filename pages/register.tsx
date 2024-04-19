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
      <form onSubmit={handleSubmit} className='p-8 bg-white rounded shadow-md w-80'>
        <h2 className='text-2xl font-bold mb-8 text-center'>Register</h2>
        <input
          type='text'
          name='username'
          required
          placeholder='Username'
          onChange={handleChange}
          className='mb-4 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <input
          type='email'
          name='email'
          required
          placeholder='Email'
          onChange={handleChange}
          className='mb-4 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <input
          type='password'
          name='password1'
          required
          placeholder='Password'
          onChange={handleChange}
          className='mb-4 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <input
          type='password'
          name='password2'
          required
          placeholder='Confirm Password'
          onChange={handleChange}
          className='mb-6 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <button
          type='submit'
          className='w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none'
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
