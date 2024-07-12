'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LearnButton from './LearnButton';

export default function WordWrapper({ userId, word }: { userId: string; word: any }) {
  const supabase = createClient();
  const [isLearned, setIsLearned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLearned = async () => {
      const { data, error } = await supabase
        .from('user_word_progress')
        .select('*')
        .match({ user_id: userId, word_id: word.id })
        .single();

      if (error && error.code !== 'PGRST116') {
        // Ignore the "no rows found" error
        console.error('Error getting word:', error);
        setLoading(false);
        return;
      }

      setIsLearned(!!data.completed);
      setLoading(false);
    };

    checkLearned();
  }, [supabase, userId, word.id]);

  if (loading) {
    return <div className='w-full h-11 bg-slate-200 animate-pulse rounded-md mb-2'></div>;
  }

  return (
    <AccordionItem key={word.id} value={word.id} className='w-full'>
      <AccordionTrigger className={`${isLearned && 'text-green-500'}`}>{word.word}</AccordionTrigger>
      <AccordionContent>
        <p className='font-bold'>Definition:</p>
        <ul>
          {word.definitions.map((def: string) => (
            <li key={def}>{def}</li>
          ))}
        </ul>
        <p className='font-bold'>Examples:</p>
        <ul className='mb-2'>
          {word.examples.map((ex: string) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
        <LearnButton userId={userId} word={word} isLearned={isLearned} setIsLearned={setIsLearned} />
      </AccordionContent>
    </AccordionItem>
  );
}
