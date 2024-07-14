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

const formSchema = z.object({
  typedWord: z.string().min(1, {
    message: 'Please type the word.',
  }),
});

interface Step9Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
}

const Step9: React.FC<Step9Props> = ({ word, onAnswer }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typedWord: '',
    },
  });

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
          Type the word for the given definitions:
        </CardTitle>
        <CardDescription>{word.definitions.join('; ')}</CardDescription>
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
                  <FormDescription>Type the word that matches the given definitions</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step9;