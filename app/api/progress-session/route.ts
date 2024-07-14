// app/api/progress-session/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient(); // Ensure this is within the request scope
    const { sessionId, wordId, correct, step } = await req.json();

    // Fetch the current step for the given word in the session
    const { data: sessionWordData, error: sessionWordError } = await supabase
      .from('session_words')
      .select('current_step')
      .eq('session_id', sessionId)
      .eq('word_id', wordId)
      .single();

    if (sessionWordError || !sessionWordData) {
      console.error('Error fetching session word:', sessionWordError);
      return NextResponse.json({ error: sessionWordError?.message || 'Session word not found' }, { status: 400 });
    }

    const currentStep = sessionWordData.current_step;
    const newStep = correct ? step : 1;

    // Update the current step in the session_words table
    const { error: updateError } = await supabase
      .from('session_words')
      .update({ current_step: newStep })
      .eq('session_id', sessionId)
      .eq('word_id', wordId);

    if (updateError) {
      console.error('Error updating session word step:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
