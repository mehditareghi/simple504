import axios from 'axios';
import React, { SyntheticEvent, useState } from 'react';
import { API_URL } from '@/utils/constants';
import { useDispatch } from 'react-redux';
import { UserState, setUser } from '@/state/user/userSlice';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

const Login = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleChange = (e: SyntheticEvent) => {
    setFormData({ ...formData, [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const isEmail = formData.usernameOrEmail.includes('@');

    const requestBody = isEmail
      ? { email: formData.usernameOrEmail, password: formData.password }
      : { username: formData.usernameOrEmail, password: formData.password };
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, requestBody);
      const userObject = {
        token: response.data.key,
        pk: response.data.user.pk,
        firstName: response.data.user.first_name,
        lastName: response.data.user.last_name,
        email: response.data.user.email,
        username: response.data.user.username,
      };
      dispatch(setUser(userObject));
      Cookies.set('token', response.data.key); // Cookie will expire after 7 days
      router.push('/courses');
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };

  if (user && user.token) {
    router.push('/courses');
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='p-8 bg-white rounded shadow-md w-80'>
        <h2 className='H2'>Login</h2>
        <input
          type='text'
          name='usernameOrEmail'
          required
          placeholder='Username or Email'
          onChange={handleChange}
          className='field'
        />
        <input
          type='password'
          name='password'
          required
          placeholder='Password'
          onChange={handleChange}
          className='field'
        />
        <button
          type='submit'
          className='btn'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
