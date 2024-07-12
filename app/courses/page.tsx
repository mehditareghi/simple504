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

/*   if (!user) {
    return redirect('/login');
  }

  if (!user) {
    console.error('No user is logged in.');
    return; // Handle the case where no user is logged in
  } */

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
    .eq('user_id', user?.id);

  if (userCoursesError) {
    console.error('Error fetching user courses:', userCoursesError);
  }

  const userCourseMap = userCourses && new Map(userCourses.map((uc) => [uc.course_id, uc]));

  return (
    <div className='flex-1 w-full flex flex-col gap-10 items-center'>
      {courses.map((course) => {
        const userCourse = userCourseMap && userCourseMap.get(course.id);
        return (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {!!user && !!userCourse && (
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
              <EnrollButton userId={user?.id} courseId={course.id} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
