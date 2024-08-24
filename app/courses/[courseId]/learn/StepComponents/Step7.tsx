"use client";

import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MicIcon, Loader2Icon } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Step7Props {
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
  setCorrectAnswers: Dispatch<SetStateAction<number>>;
}

const Step7: FC<Step7Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const onSubmit = async () => {
    const correct = transcript.toLowerCase().trim() === word.word.toLowerCase();
    let updatePattern = {};
    if (correct) {
      updatePattern = { step: 8 };
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

  const handleStartListening = () => {
    SpeechRecognition.startListening();
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <Card className="p-6 rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Pronounce the word: {word.word}
        </CardTitle>
        <CardDescription>
          Press and hold the microphone icon, then pronounce the word clearly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-center justify-center">
          <Button
            onMouseDown={handleStartListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
            onTouchStart={handleStartListening}
            onTouchEnd={handleStopListening}
            className="flex items-center justify-center p-4 rounded-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500"
          >
            {listening ? (
              <Loader2Icon className="w-6 h-6 animate-spin text-white" />
            ) : (
              <MicIcon className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>
        <p className="mt-4 text-center">
          Spoken word:{" "}
          <span
            className={`font-bold ${
              isCorrect === false
                ? "text-red-400 dark:text-red-500"
                : "text-green-400 dark:text-green-500"
            }`}
          >
            {transcript.toLowerCase().trim()}
          </span>
        </p>
        <Separator className="my-4" />
        {submitted ? (
          isCorrect ? (
            <Progress
              value={progress}
              className="w-full bg-green-400 dark:bg-green-600"
            />
          ) : showProgressBar ? (
            <Progress
              value={progress}
              className="w-full bg-red-400 dark:bg-red-600"
            />
          ) : (
            <Button onClick={handleNextClick} className="w-full">
              Next
            </Button>
          )
        ) : (
          <Button
            onClick={onSubmit}
            className="w-full"
            disabled={listening || !transcript}
          >
            Submit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Step7;
