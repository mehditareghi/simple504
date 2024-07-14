import { createClient } from '@/utils/supabase/server';
import LearningSession from './LearningSession';
import { redirect } from 'next/navigation';

interface Params {
  params: {
    courseId: string;
  };
}

export default async function LearnPage({ params }: Params) {
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
  const { courseId } = params;
  return <LearningSession courseId={courseId} userId={user.id} />;
}
