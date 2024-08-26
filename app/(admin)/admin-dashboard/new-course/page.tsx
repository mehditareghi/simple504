import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/app/login/submit-button";

export default async function NewCourse() {
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

  const addNewCourse = async (formData: FormData) => {
    "use server";

    const supabase = createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const { data, error } = await supabase
      .from("courses")
      .insert({ name, description });

    if (error) {
      console.error("Error adding course:", error);
      return;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Add new course</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-foreground"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground"
                  htmlFor="description"
                >
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  type="description"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <SubmitButton
                formAction={addNewCourse}
                pendingText="Adding Course..."
                className="w-full"
              >
                Add Course
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
