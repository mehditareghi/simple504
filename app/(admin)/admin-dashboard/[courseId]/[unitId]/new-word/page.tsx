import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/app/login/submit-button";
import { Textarea } from "@/components/ui/textarea";

interface Params {
  courseId: string;
  unitId: string;
}

export default async function NewUnit({ params }: { params: Params }) {
  const { courseId, unitId } = params;
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

  const addNewWord = async (formData: FormData) => {
    "use server";

    const supabase = createClient();

    const unit_id = formData.get("unit_id") as string;
    const word = formData.get("word") as string;
    const definitions = formData.get("definitions") as string;
    const examples = formData.get("examples") as string;
    const order = formData.get("order") as number;
    const phonetics = formData.get("phonetics") as string;
    const image = formData.get("image") as string;

    const { data, error } = await supabase.from("words").insert({
      unit_id,
      word,
      definitions: definitions
        .split("\n")
        .map((def) => def.trim())
        .filter(Boolean),
      examples: examples
        .split("\n")
        .map((ex) => ex.trim())
        .filter(Boolean),
      order,
      phonetics,
      image,
    });

    if (error) {
      console.error("Error adding word:", error);
      return;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader className="text-center">
          <CardTitle className="H3">Add new word</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="word">
                  Word
                </label>
                <Input
                  id="word"
                  name="word"
                  type="text"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="phonetics"
                >
                  Phonetics
                </label>
                <Input
                  id="phonetics"
                  name="phonetics"
                  type="text"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="definitions"
                >
                  Definitions (one per line)
                </label>
                <Textarea
                  id="definitions"
                  name="definitions"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium" htmlFor="examples">
                  Examples (one per line)
                </label>
                <Textarea
                  id="examples"
                  name="examples"
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

              <div>
                <label className="block text-sm font-medium" htmlFor="image">
                  Image
                </label>
                <Input
                  id="image"
                  name="image"
                  type="text"
                  placeholder=""
                  className="mt-1"
                  required
                />
              </div>

              <div className="hidden">
                <label className="block text-sm font-medium" htmlFor="unit_id">
                  Unit ID
                </label>
                <Input
                  id="unit_id"
                  name="unit_id"
                  value={unitId}
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
                formAction={addNewWord}
                pendingText="Adding Word..."
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
