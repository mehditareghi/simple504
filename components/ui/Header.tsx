import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import Cookies from 'js-cookie';
import { API_URL } from '@/utils/constants';
import { UserState, clearUser } from '@/state/user/userSlice';
import { useRouter } from 'next/router';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user) as UserState;
  const dispatch = useDispatch();
  const router = useRouter()

  const logout = async () => {
    const response = await fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${user && user.token}`, // replace with actual token
      },
    });

    if (response.ok) {
      Cookies.remove('token');
      dispatch(clearUser());
      router.push('/login')
    }
  };

  return (
    <header className='bg-blue-500 p-4'>
      <div className='container mx-auto flex flex-wrap items-center justify-between'>
        <Link href='/' className='flex items-center text-white no-underline'>
          <span className='text-xl pl-2'>Website Name</span>
        </Link>

        <button className='p-2 transform -translate-y-1/2 top-1/2 right-0 sm:hidden' onClick={() => setIsOpen(!isOpen)}>
          <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </button>

        <nav className={`sm:flex sm:items-center ${isOpen ? 'block' : 'hidden'}`}>
          <Link href='/courses' className='block mt-4 sm:inline-block sm:mt-0 mr-4'>
            Courses
          </Link>
          <Link href='/' className='block mt-4 sm:inline-block sm:mt-0 mr-4'>
            Blog
          </Link>
          {user && user.token ? (
            <>
              <Link href='/' className='block mt-4 sm:inline-block sm:mt-0'>
                {user.firstName}
              </Link>
              <button onClick={logout} className='block mt-4 sm:inline-block sm:mt-0'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href='/login' className='block mt-4 sm:inline-block sm:mt-0 mr-4'>
                Login
              </Link>
              <Link href='/register' className='block mt-4 sm:inline-block sm:mt-0'>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
