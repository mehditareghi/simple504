'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LearnButton({ userId, word, isLearned, setIsLearned }: { userId: string; word: any, isLearned: boolean, setIsLearned: any}) {
  const supabase = createClient();

  const onClick = async () => {
    const { data, error } = await supabase
      .from('user_word_progress')
      .update({
        user_id: userId,
        word_id: word.id,
        completed: !isLearned,
      })
      .match({ user_id: userId, word_id: word.id });
    if (error) {
      console.error('Error updating word:', error);
      return; // Handle the error according to your app's flow
    }
    toast(`Good job! You learned the word ${word.word}.`);
    setIsLearned(!isLearned); // Update the state to reflect enrollment
  };

  return (
    <Button variant='default' onClick={onClick} className='w-full'>
      {isLearned ? 'I want to learn this again' : 'Learn'}
    </Button>
  );
}
