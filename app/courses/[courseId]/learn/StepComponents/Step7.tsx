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
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { keyframes } from "@stitches/react";
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

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

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
        <CardTitle className="text-2xl font-bold text-gray-800">
          Pronounce the word: {word.word}
        </CardTitle>
        <CardDescription>
          Hold the button below and pronounce the word clearly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-center">
          <Button
            onMouseDown={handleStartListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
            onTouchStart={handleStartListening}
            onTouchEnd={handleStopListening}
            className={`flex items-center gap-2 ${listening ? "animate-pulse" : ""}`}
            style={listening ? { animation: `${pulse} 1s infinite` } : {}}
          >
            <SpeakerLoudIcon className="w-5 h-5" />
            {listening ? "Listening..." : "Hold to Pronounce"}
          </Button>
        </div>
        <p className="mt-4">
          Spoken word:{" "}
          <span
            className={`font-bold ${isCorrect === false ? "text-red-500" : "text-green-500"}`}
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
              className="w-full bg-yellow-400 dark:bg-yellow-"
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
