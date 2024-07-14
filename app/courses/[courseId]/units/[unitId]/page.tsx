import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WordWrapper from '@/app/courses/components/WordWrapper';

interface Params {
  courseId: string;
  unitId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { courseId, unitId } = params;
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
    console.error('Error fetching words:', error);
    return; // Handle the error according to your app's flow
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center p-6">
      <WordWrapper words={data} />
    </div>
  );
}