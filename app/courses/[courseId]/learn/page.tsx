import { createClient } from "@/utils/supabase/server";
import LearningSession from "./LearningSession";
import { redirect } from "next/navigation";

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

  // Fetch possible session length
  const response = await fetch(
    "http://localhost:3000/api/possible-session-length",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, courseId }),
    },
  );

  const { sessionLength } = await response.json();

  if (sessionLength === 0) {
    return (
      <div>
        <h1>No words to learn</h1>
        <p>You have already learned all the words in this course.</p>
      </div>
    );
  }

  const firstWordResponse = await fetch(
    "http://localhost:3000/api/words/get-next-word",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, courseId }),
    },
  );

  const firstWord = await firstWordResponse.json();

  return (
    <LearningSession
      courseId={courseId}
      userId={user.id}
      sessionLength={sessionLength}
      firstWord={firstWord}
    />
  );
}
