'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EnrollButton({ userId, courseId }: { userId: string | undefined; courseId: string }) {
  const supabase = createClient();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      const { data, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Ignore the "no rows found" error
        console.error('Error checking enrollment:', error);
        setLoading(false);
        return;
      }

      setIsEnrolled(!!data);
      setLoading(false);
    };

    checkEnrollment();
  }, [supabase, userId, courseId]);

  const onClick = async () => {
    const { data, error } = await supabase.from('user_courses').insert({
      user_id: userId,
      course_id: courseId,
    });
    if (error) {
      console.error('Error enrolling user:', error);
      return; // Handle the error according to your app's flow
    }
    toast('You enrolled in the course!');
    setIsEnrolled(true); // Update the state to reflect enrollment
  };

  if (loading) {
    return <div className='w-full h-9 bg-slate-200 animate-pulse rounded-md'></div>;
  }

  return isEnrolled ? (
    <Button asChild variant='outline' className='w-full'>
      <Link
        href={`/courses/${courseId}`}
        className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
      >
        Go to Course
      </Link>
    </Button>
  ) : !!userId ? (
    <Button variant='default' onClick={onClick} className='w-full'>
      Enroll
    </Button>
  ) : (
    <Button asChild variant='outline' className='w-full'>
      <Link
        href={`/login`}
        className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
      >
        Log in to enroll
      </Link>
    </Button>
  );
}
