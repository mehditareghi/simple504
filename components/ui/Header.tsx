import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import Cookies from 'js-cookie';
import { API_URL } from '@/utils/constants';
import { UserState, clearUser } from '@/state/user/userSlice';
import { useRouter } from 'next/router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user) as UserState;
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = async () => {
    const response = await fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${user && user.token}`,
      },
    });

    if (response.ok) {
      Cookies.remove('token');
      dispatch(clearUser());
      router.push('/login');
    }
  };

  return (
    <header className='bg-blue-500 p-4'>
      <div className='container mx-auto flex flex-wrap items-center justify-between'>
        <Link href='/' className='flex items-center no-underline'>
          <span className='text-xl pl-2 italic font-bold c-accent11'>SIMPLE 504</span>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='rounded-xl py-1 px-2 border border-accent8 items-center justify-center text-accent11 bg-white outline-none hover:bg-accent3'>
                  {user.firstName}
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className='min-w-[220px] bg-white rounded-xl p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade'
                  sideOffset={5}
                >
                  <DropdownMenu.Item className='group text-[13px] leading-none text-accent11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent9 data-[highlighted]:text-accent1'>
                    New Tab
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className='group text-[13px] leading-none text-accent11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent9 data-[highlighted]:text-accent1'>
                    New Window
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className='h-[1px] bg-accent6 m-[5px]' />
                  <DropdownMenu.Item className='group text-[13px] leading-none text-accent11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent9 data-[highlighted]:text-accent1'>
                    <button onClick={logout}>
                      Logout
                    </button>
                  </DropdownMenu.Item>

                  <DropdownMenu.Arrow className='fill-white' />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
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
