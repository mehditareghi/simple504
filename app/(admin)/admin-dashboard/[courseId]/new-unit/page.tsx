import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/app/login/submit-button";

interface Params {
  courseId: string;
}

export default async function NewUnit({ params }: { params: Params }) {
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

  const addNewUnit = async (formData: FormData) => {
    "use server";

    const supabase = createClient();

    const title = formData.get("title") as string;
    const order = formData.get("order") as number;
    const course_id = formData.get("course_id") as string;

    const { data, error } = await supabase
      .from("units")
      .insert({ title, course_id, order });

    if (error) {
      console.error("Error adding unit:", error);
      return;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader className="text-center">
          <CardTitle className="H3">Add new unit</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="title">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="description"
                >
                  Order
                </label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>

              <div className="hidden">
                <label
                  className="block text-sm font-medium"
                  htmlFor="course_id"
                >
                  Course ID
                </label>
                <Input
                  id="course_id"
                  name="course_id"
                  value={courseId}
                  type="text"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <SubmitButton
                formAction={addNewUnit}
                pendingText="Adding Unit..."
                className="w-full"
              >
                Add Unit
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
