'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { keyframes } from '@stitches/react';
import { useState } from 'react';

const formSchema = z.object({
  typedWord: z.string().min(1, {
    message: 'Please type the word.',
  }),
});

interface Step8Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.8 },
});

const Step8: React.FC<Step8Props> = ({ word, onAnswer }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typedWord: '',
    },
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.speak(utterance);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.typedWord.trim().toLowerCase() === word.word.toLowerCase()) {
      onAnswer(true);
    } else {
      onAnswer(false);
    }
    form.reset();
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Type the word for the pronunciation:
        </CardTitle>
        <CardDescription>
          <button onClick={handlePlayAudio} className="text-blue-500 hover:text-blue-700 focus:outline-none">
            <SpeakerLoudIcon
              className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
            />
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="typedWord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type the word</FormLabel>
                  <FormControl>
                    <Input placeholder="Type the word" {...field} />
                  </FormControl>
                  <FormDescription>Listen to the pronunciation and type the word</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step8;