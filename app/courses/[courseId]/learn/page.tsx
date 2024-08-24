import { createClient } from "@/utils/supabase/server";
import LearningSession from "./LearningSession";
import { redirect } from "next/navigation";
import { getNextWord, getSessionLength } from "@/utils/wordSelector";

interface Params {
  params: {
    courseId: string;
  };
}

export default async function LearnPage({ params }: Params) {
  const supabase = createClient();
  const { courseId } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  if (!user) {
    console.error("No user is logged in.");
    return; // Handle the case where no user is logged in
  }

  const { data: userWords, error: userWordsError } = await supabase
    .from("ordered_user_words")
    .select(
      `
      word_id,
      user_id,
      step,
      show_first_step,
      course_id,
      word, definitions, examples, note, phonetics
    `,
    )
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("completed", false)
    .limit(12);

  if (userWordsError) {
    console.error("Error fetching user words:", userWordsError);
  }

  console.log(userWords);

  const sessionLength = getSessionLength(userWords);

  if (sessionLength === 0)
    return (
      <div>
        <h1>No words to learn</h1>
        <p>You have already learned all the words in this course.</p>
      </div>
    );

  const firstWord = getNextWord(userWords);

  return (
    <LearningSession
      courseId={courseId}
      userId={user.id}
      sessionLength={sessionLength}
      firstWord={firstWord}
    />
  );
}
