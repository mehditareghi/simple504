import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { WordCard } from "@/components/WordCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface Params {
  courseId: string;
  unitId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
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

  const { data, error } = await supabase
    .from("words")
    .select("id, word, order, definitions, examples, phonetics")
    .match({ unit_id: unitId })
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching words:", error);
    return;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="H3">Unit Details</h1>
        <Button asChild variant="default" className="flex items-center gap-2">
          <Link href={`/admin-dashboard/${courseId}/${unitId}/new-word`}>
            <PlusIcon className="w-4 h-4" />
            Add New Word
          </Link>
        </Button>
      </div>
      {data.map((wordData) => (
        <WordCard key={wordData.id} wordData={wordData} />
      ))}
    </div>
  );
}
