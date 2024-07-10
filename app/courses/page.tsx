import DeployButton from '@/components/DeployButton';
import AuthButton from '@/components/AuthButton';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EnrollButton from './components/EnrollButton';
import { Progress } from '@/components/ui/progress';
import { redirect } from 'next/navigation';

export default async function CoursesPage() {
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

  // Fetch courses
  const { data: courses, error: coursesError } = await supabase.from('courses').select('*');
  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
    return; // Handle the error according to your app's flow
  }

  // Fetch user courses
  const { data: userCourses, error: userCoursesError } = await supabase
    .from('user_courses')
    .select('*')
    .eq('user_id', user.id);

  if (userCoursesError) {
    console.error('Error fetching user courses:', userCoursesError);
    return; // Handle the error according to your app's flow
  }

  const userCourseMap = new Map(userCourses.map((uc) => [uc.course_id, uc]));

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

      {courses.map((course) => {
        const userCourse = userCourseMap.get(course.id);
        return (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {!!userCourse && (
                <Progress
                  value={(userCourse.progress / course.word_count) * 100}
                  className={`${
                    (userCourse.progress / course.word_count) * 100 === 100
                      ? 'bg-green-500'
                      : (userCourse.progress / course.word_count) * 100 === 0
                      ? ''
                      : 'bg-orange-500'
                  }`}
                />
              )}
            </CardContent>
            <CardFooter>
              <EnrollButton userId={user.id} courseId={course.id} />
            </CardFooter>
          </Card>
        );
      })}

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
