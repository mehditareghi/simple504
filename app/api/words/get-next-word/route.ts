import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Word {
  word_id: string;
  step: number;
  show_first_step: boolean;
  words: {
    id: string;
    order: number;
    word: string;
    definitions: string[];
    examples: string[];
    units: {
      id: string;
      course_id: string;
      order: number;
    };
  };
}

const getNextWord = (userWords: Word[]): Word | null => {
  if (userWords.length === 0) {
    console.log("No words available.");
    return null;
  }

  const sortedWords = userWords.sort((a, b) => {
    if (a.words.units.order === b.words.units.order) {
      return a.words.order - b.words.order;
    }
    return a.words.units.order - b.words.units.order;
  });

  // Check if there is a word with show_first_step true and return it
  const showFirstStepWord = sortedWords.find((word) => word.show_first_step);
  if (showFirstStepWord) {
    console.log("Returning word with show_first_step true");
    return showFirstStepWord;
  }

  // Check if all steps are the same
  const allStepsSame = sortedWords.every(
    (word) => word.step === sortedWords[0].step,
  );

  if (allStepsSame) {
    // Return the record with the lowest order
    console.log("All steps are the same, returning the first word");
    return sortedWords[0];
  }

  // Check if there is a word with step 4 and no words with step 2 or 3
  const step4Word = sortedWords.find((word) => word.step === 4);
  const step2or3Word = sortedWords.find(
    (word) => word.step === 2 || word.step === 3,
  );
  if (step4Word && !step2or3Word) {
    const step1Words = sortedWords.filter((word) => word.step === 1);
    if (step1Words.length > 0) {
      console.log(
        "Step 4 found and no step 2 or 3, returning the first step 1 word",
      );
      return step1Words[0];
    }
  }

  // Check the condition for step differences without filtering out step 1 words
  for (let i = 0; i < sortedWords.length; i++) {
    const currentWord = sortedWords[i];
    for (let j = i + 1; j < sortedWords.length; j++) {
      const nextWord = sortedWords[j];
      if (currentWord.step + 1 - nextWord.step <= 3) {
        console.log(
          "Found a suitable word based on step difference condition:",
          currentWord,
        );
        return currentWord;
      }
    }
  }

  // If no word meets the condition, return the first word with step 1
  const step1Word = sortedWords.find((word) => word.step === 1);
  if (step1Word) {
    console.log("Returning the first step 1 word");
    return step1Word;
  }

  // If no step 1 word exists, return the first word in sorted order
  console.log("Returning the first word in sorted order");
  return sortedWords[0];
};

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { userId, courseId } = await req.json();

    const { data: userWords, error: userWordsError } = await supabase
      .from("user_word_progress")
      .select(
        `
        word_id,
        user_id,
        step,
        show_first_step,
        completed,
        words!inner(id, order, word, definitions, examples, units!inner(id, course_id, order))
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

    const nextWord = getNextWord(userWords);

    return NextResponse.json(nextWord);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
