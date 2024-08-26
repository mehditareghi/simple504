import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EnrollButton from "./components/EnrollButton";
import { Progress } from "@/components/ui/progress";

export default async function CoursesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch courses
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, name, description, word_count")
    .match({ published: true });
  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return; // Handle the error according to your app's flow
  }

  // Fetch user courses
  const { data: userCourses, error: userCoursesError } = await supabase
    .from("user_courses")
    .select("course_id, progress")
    .eq("user_id", user?.id);

  if (userCoursesError) {
    console.error("Error fetching user courses:", userCoursesError);
  }

  const userCourseMap =
    userCourses && new Map(userCourses.map((uc) => [uc.course_id, uc]));

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const userCourse = userCourseMap && userCourseMap.get(course.id);
          return (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {course.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!!user && !!userCourse && (
                  <Progress
                    value={(userCourse.progress / course.word_count) * 100}
                    className={`${
                      (userCourse.progress / course.word_count) * 100 === 100
                        ? "bg-green-400 dark:bg-green-600"
                        : (userCourse.progress / course.word_count) * 100 === 0
                          ? ""
                          : "bg-yellow-400 dark:bg-yellow-600"
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
    </div>
  );
}
