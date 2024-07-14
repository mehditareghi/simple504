import { createClient } from '@/utils/supabase/server';
import { Accordion } from '@/components/ui/accordion';
import WordWrapper from '@/app/courses/components/WordWrapper';
import { redirect } from 'next/navigation';
import First from '@/components/steps/First';
import StepHandler from '@/components/steps/StepHandler';

interface Params {
  wordId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { wordId } = params;
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

  const { data, error } = await supabase
    .from('user_word_progress')
    .select(`word_id, user_id, step, show_first_step, words!inner(*)`)
    .match({ word_id: wordId, user_id: user.id })
    .single();

  if (error) {
    console.error('Error fetching word:', error);
    return; // Handle the error according to your app's flow
  }

  console.log(data);

  return (
    <div className='flex-1 w-full flex flex-col gap-10 items-start'>
      {/* <WordWrapper userId={user.id} word={data.words} /> */}
      <StepHandler initialData={data} />
    </div>
  );
}
