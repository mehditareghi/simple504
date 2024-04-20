import { ReactNode } from 'react';
import Header from '../ui/Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />
      <main className='flex-grow p-4'>{children}</main>
      <footer className='p-4 bg-blue-500 text-white'>
        <p>Footer content</p>
      </footer>
    </div>
  );
};

export default Layout;
