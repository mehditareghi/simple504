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
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { keyframes } from "@stitches/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  typedWord: z.string().min(1, {
    message: "Please type the word.",
  }),
});

interface Step8Props {
  word: {
    word_id: string;
    user_id: string;
    step: number;
    show_first_step: boolean;
    course_id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onNext: () => void;
  setCorrectAnswers: (correctAnswers: number) => void;
}

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

const Step8: React.FC<Step8Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typedWord: "",
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (submitted && isCorrect) {
      onNext();
      return;
    }

    const correct =
      data.typedWord.trim().toLowerCase() === word.word.toLowerCase();
    let updatePattern = correct ? { step: 9 } : { show_first_step: true };

    const { error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });

    if (error) {
      console.error("Error updating user_word_progress", error);
    }

    setSubmitted(true);
    setIsCorrect(correct);
    setCorrectAnswers((prev) => (correct ? prev + 1 : prev - 1));

    if (correct) {
      setShowProgressBar(true);
    }
  };

  useEffect(() => {
    if (showProgressBar) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onNext();
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [showProgressBar, onNext]);

  const handleNextClick = () => {
    setShowProgressBar(true);
    setProgress(0); // Reset progress for smooth transition
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Type the word for the pronunciation:
        </CardTitle>
        <CardDescription>
          <button
            onClick={handlePlayAudio}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <SpeakerLoudIcon
              className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`}
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
                    <Input
                      placeholder="Type the word"
                      {...field}
                      className={
                        isCorrect === false
                          ? "border-red-500"
                          : isCorrect === true
                            ? "border-green-500"
                            : ""
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Listen to the pronunciation and type the word
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            {submitted ? (
              isCorrect ? (
                <Progress value={progress} className="w-full bg-green-500" />
              ) : showProgressBar ? (
                <Progress value={progress} className="w-full bg-orange-500" />
              ) : (
                <Button onClick={handleNextClick} className="w-full">
                  Next
                </Button>
              )
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={!form.watch("typedWord")}
              >
                Submit
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step8;
