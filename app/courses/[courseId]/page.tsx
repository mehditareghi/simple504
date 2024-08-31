import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { redirect } from "next/navigation";

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
    return redirect("/login");
  }

  // Fetch units for the course
  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("id, title, word_count, order")
    .eq("course_id", courseId)
    .order("order", { ascending: true });
  if (unitsError) {
    console.error("Error fetching units:", unitsError);
    return; // Handle the error according to your app's flow
  }

  // Fetch user unit progress
  const { data: userUnitProgress, error: userUnitProgressError } =
    await supabase
      .from("user_unit_progress")
      .select("unit_id, progress")
      .eq("user_id", user.id);

  if (userUnitProgressError) {
    console.error("Error fetching user unit progress:", userUnitProgressError);
    return; // Handle the error according to your app's flow
  }

  const userUnitProgressMap = new Map(
    userUnitProgress.map((uup) => [uup.unit_id, uup]),
  );

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Course Overview</CardTitle>
          <CardDescription>
            Start a learning session to continue your progress in this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={`/courses/${courseId}/learn`} className="px-4 py-2">
              Start Learning Session
            </Link>
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const userProgress = userUnitProgressMap.get(unit.id)
            ? (userUnitProgressMap.get(unit.id).progress / unit.word_count) *
              100
            : 0;

          return (
            <Card key={unit.id}>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {unit.title}
                </CardTitle>
                <CardDescription>{unit.word_count} words</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={userProgress}
                  className={`${
                    userProgress === 100
                      ? "bg-green-400 dark:bg-green-600"
                      : userProgress > 0
                        ? "bg-yellow-400 dark:bg-yellow-600"
                        : ""
                  }`}
                />
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={`/courses/${courseId}/units/${unit.id}`}
                    className="py-2 px-3 flex rounded-md no-underline"
                  >
                    View Unit Details
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
