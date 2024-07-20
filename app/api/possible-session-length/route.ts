import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { userId, courseId } = await req.json();

    // Fetch the user's word progress for the specified course
    const { data: userWords, error: userWordsError } = await supabase
      .from("user_word_progress")
      .select(
        `
        step,
        show_first_step,
        words!inner(units!inner(course_id))
      `,
      )
      .eq("user_id", userId)
      .eq("words.units.course_id", courseId)
      .eq("completed", false);

    if (userWordsError) {
      console.error("Error fetching user words:", userWordsError);
      return NextResponse.json(
        { error: userWordsError.message },
        { status: 400 },
      );
    }

    // Calculate the possible session length
    let sessionLength = userWords.reduce(
      (sum, word) => sum + (10 - word.step),
      0,
    );

    // Add 1 for each word with show_first_step set to true
    const showFirstStepCount = userWords.filter(
      (word) => word.show_first_step,
    ).length;
    sessionLength += showFirstStepCount;

    // Limit the session length to a maximum of 10
    sessionLength = sessionLength > 10 ? 10 : sessionLength;

    return NextResponse.json({ sessionLength }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
