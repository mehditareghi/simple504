"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  typedWord: z.string().min(1, {
    message: "Please type the word.",
  }),
});

interface Step9Props {
  word: {
    word_id: string;
    user_id: string;
    step: number;
    show_first_step: boolean;
    completed: boolean;
    words: {
      word: string;
      definitions: string[];
      examples: string[];
    };
  };
  onNext: () => void;
  setCorrectAnswers: (correctAnswers: number) => void;
}

const Step9: React.FC<Step9Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typedWord: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (submitted) {
      onNext();
      return;
    }
    let updatePattern = {};
    if (data.typedWord.trim().toLowerCase() === word.words.word.toLowerCase()) {
      updatePattern = { step: 10, completed: true };
    } else {
      updatePattern = { show_first_step: true };
    }

    const { error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev) =>
      data.typedWord.trim().toLowerCase() === word.words.word.toLowerCase()
        ? prev + 1
        : prev - 1,
    );
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Type the word for the given definitions:
        </CardTitle>
        <CardDescription>{word.words.definitions.join("; ")}</CardDescription>
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
                  <FormDescription>
                    Type the word that matches the given definitions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            <Button
              type="submit"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              {submitted ? "Next" : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step9;
