import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  if (
    !user.user_metadata.role ||
    (user.user_metadata.role && user.user_metadata.role !== "admin")
  ) {
    return redirect("/courses");
  }

  // Fetch units for the course
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*");
  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return; // Handle the error according to your app's flow
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
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
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/admin-dashboard/${course.id}`}
                    className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                  >
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}