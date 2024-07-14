// app/api/create-session/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const supabase = createClient(); // Ensure this is within the request scope
    const {
      userId,
      maxWords = 10,
      newWordsCount = 3,
      targetCorrectAnswers = 10,
    } = await req.json();
    const sessionId = uuidv4();

    console.log("Creating a new session with ID:", sessionId);

    // Create a new session
    const { data: sessionData, error: sessionError } = await supabase
      .from("learning_sessions")
      .insert([{ id: sessionId, user_id: userId }])
      .select();

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return NextResponse.json(
        { error: sessionError.message },
        { status: 400 },
      );
    }

    console.log("Session created:", sessionData);

    // Fetch new words with step = 1 in order
    const { data: newWords, error: newWordsError } = await supabase
      .from("user_word_progress")
      .select(
        `
        word_id,
        step,
        words!inner(id, unit_id, order, word, definitions, examples)
      `,
      )
      .eq("user_id", userId)
      .eq("step", 1)
      .order("unit_id", { foreignTable: "words", ascending: true })
      .order("order", { foreignTable: "words", ascending: true })
      .limit(newWordsCount);

    if (newWordsError) {
      console.error("Error fetching new words:", newWordsError);
      return NextResponse.json(
        { error: newWordsError.message },
        { status: 400 },
      );
    }

    console.log("New words fetched:", newWords);

    // Fetch partially learned words with step > 1 and step < 9 in order
    const { data: partialWords, error: partialWordsError } = await supabase
      .from("user_word_progress")
      .select(
        `
        word_id,
        step,
        words!inner(id, unit_id, order, word, definitions, examples)
      `,
      )
      .eq("user_id", userId)
      .gt("step", 1)
      .lt("step", 9)
      .order("unit_id", { foreignTable: "words", ascending: true })
      .order("order", { foreignTable: "words", ascending: true })
      .limit(maxWords - newWordsCount);

    if (partialWordsError) {
      console.error(
        "Error fetching partially learned words:",
        partialWordsError,
      );
      return NextResponse.json(
        { error: partialWordsError.message },
        { status: 400 },
      );
    }

    console.log("Partially learned words fetched:", partialWords);

    const sessionWords = [
      ...newWords.map((word) => ({
        session_id: sessionId,
        word_id: word.word_id,
        current_step: word.step,
      })),
      ...partialWords.map((word) => ({
        session_id: sessionId,
        word_id: word.word_id,
        current_step: word.step,
      })),
    ];

    console.log("Session words to be inserted:", sessionWords);

    // Insert session words
    const { data: sessionWordsData, error: sessionWordsError } = await supabase
      .from("session_words")
      .insert(sessionWords)
      .select();

    if (sessionWordsError) {
      console.error("Error inserting session words:", sessionWordsError);
      return NextResponse.json(
        { error: sessionWordsError.message },
        { status: 400 },
      );
    }

    console.log("Session words inserted:", sessionWordsData);

    // Construct the response with detailed word information
    const detailedWords = [
      ...newWords.map((word) => ({
        id: word.words.id,
        word: word.words.word,
        definitions: word.words.definitions,
        examples: word.words.examples,
      })),
      ...partialWords.map((word) => ({
        id: word.words.id,
        word: word.words.word,
        definitions: word.words.definitions,
        examples: word.words.examples,
      })),
    ];

    return NextResponse.json({
      sessionId,
      targetCorrectAnswers,
      words: detailedWords,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
