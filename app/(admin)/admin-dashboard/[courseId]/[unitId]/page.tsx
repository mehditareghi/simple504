import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { WordCard } from "@/components/WordCard";

interface Params {
  courseId: string;
  unitId: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { unitId } = params;
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
      {data.map((wordData) => (
        <WordCard key={wordData.id} wordData={wordData} />
      ))}
    </div>
  );
}
