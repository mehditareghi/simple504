import DeployButton from '@/components/DeployButton';
import AuthButton from '@/components/AuthButton';
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { redirect } from 'next/navigation';

interface Params {
  courseId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { courseId } = params;
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

  // Fetch units for the course
  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true });
  if (unitsError) {
    console.error('Error fetching units:', unitsError);
    return; // Handle the error according to your app's flow
  }

  // Fetch user unit progress
  const { data: userUnitProgress, error: userUnitProgressError } = await supabase
    .from('user_unit_progress')
    .select('*')
    .eq('user_id', user.id);

  if (userUnitProgressError) {
    console.error('Error fetching user unit progress:', userUnitProgressError);
    return; // Handle the error according to your app's flow
  }

  const userUnitProgressMap = new Map(userUnitProgress.map((uup) => [uup.unit_id, uup]));

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
      <div className='flex w-11/12 gap-4 flex-wrap'>
        {units.map((unit) => {
          const userProgress = (userUnitProgressMap.get(unit.id).progress / unit.word_count) * 100;

          return (
            <Card key={unit.id} className={`w-[240px]`}>
              <CardHeader>
                <CardTitle>{unit.title}</CardTitle>
                <CardDescription>{unit.word_count} words</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{unit.content}</p>
                <Progress
                  value={userProgress}
                  className={`${userProgress === 100 ? 'bg-green-500' : userProgress === 0 ? '' : 'bg-orange-500'}`}
                />
              </CardContent>
              <CardFooter>
                <Button asChild className='w-full'>
                  <Link
                    href={`/courses/${courseId}/units/${unit.id}`}
                    className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
                  >
                    {userProgress === 100 ? 'Review' : userProgress === 0 ? 'Start' : 'Continue'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

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
