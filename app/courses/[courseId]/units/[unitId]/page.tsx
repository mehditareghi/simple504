import DeployButton from '@/components/DeployButton';
import AuthButton from '@/components/AuthButton';
import { createClient } from '@/utils/supabase/server';
import { Accordion } from '@/components/ui/accordion';
import WordWrapper from '@/app/courses/components/WordWrapper';
import { redirect } from 'next/navigation';

interface Params {
  courseId: string;
  unitId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { unitId } = params;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  if (!user) {
    console.error('No user is logged in.');
    return; // Handle the case where no user is logged in
  }

  const { data, error } = await supabase.from('words').select('*').match({ unit_id: unitId });

  if (error) {
    console.error('Error fetching courses:', error);
    return; // Handle the error according to your app's flow
  }

  // Use the data from the courses table as needed
  console.log('Units data:', data);

  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <div className='w-full'>
        <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
          <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
            <DeployButton />
            <AuthButton />
          </div>
        </nav>
      </div>
      <Accordion type='multiple' className='w-11/12'>
        {data.map((word) => (
          <WordWrapper key={word.id} userId={user.id} word={word} />
        ))}
      </Accordion>
      <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
        <p>
          Powered by{' '}
          <a
            href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
