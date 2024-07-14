// app/api/complete-session/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { sessionId, userId } = await req.json();
  const supabase = createClient(); // Ensure this is called correctly within the request scope

  try {
    // Logic for completing the session
    const { error: progressError } = await supabase
      .from('session_words')
      .update({ current_step: 9 })
      .eq('session_id', sessionId)
      .eq('current_step', 8);

    if (progressError) {
      return NextResponse.json({ error: progressError.message }, { status: 400 });
    }

    // Update the user_word_progress table to mark words as completed
    const { data: sessionWords, error: sessionWordsError } = await supabase
      .from('session_words')
      .select('word_id')
      .eq('session_id', sessionId);

    if (sessionWordsError) {
      return NextResponse.json({ error: sessionWordsError.message }, { status: 400 });
    }

    for (const sessionWord of sessionWords) {
      const { error: userWordProgressError } = await supabase
        .from('user_word_progress')
        .update({ step: 9 })
        .eq('user_id', userId)
        .eq('word_id', sessionWord.word_id);

      if (userWordProgressError) {
        return NextResponse.json({ error: userWordProgressError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'Session completed successfully' });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
