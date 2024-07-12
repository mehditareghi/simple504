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

  return (
    <div className='flex-1 w-full flex flex-col gap-10 items-start'>
      <Accordion type='multiple' className='w-full'>
        {data.map((word) => (
          <WordWrapper key={word.id} userId={user.id} word={word} />
        ))}
      </Accordion>
    </div>
  );
}
