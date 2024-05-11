import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { UserState } from '@/state/user/userSlice';

const WithAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const user = useSelector((state: RootState) => state.user) as UserState;
    console.log('hello there', user)

    if (user && !user.token) {
      return (
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='px-4 py-6 sm:px-0'>
            <div className='border-4 border-dashed border-gray-200 rounded-lg h-96'>
              <div className='flex items-center justify-center h-full'>
                <h1 className='text-4xl font-bold text-gray-500'>Unauthorized Access</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default WithAuth;
