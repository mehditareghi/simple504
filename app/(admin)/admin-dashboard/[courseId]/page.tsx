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

interface Params {
  courseId: string;
}

export default async function AdminDashboard({ params }: { params: Params }) {
  const { courseId } = params;
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
  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("*")
    .eq("course_id", courseId)
    .order("order", { ascending: true });
  if (unitsError) {
    console.error("Error fetching units:", unitsError);
    return; // Handle the error according to your app's flow
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          return (
            <Card
              key={unit.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {unit.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {unit.word_count} words
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/admin-dashboard/${courseId}/${unit.id}`}
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