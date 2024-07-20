"use client";

import { FC, useState } from "react";
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

interface Step7Props {
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

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

const Step7: FC<Step7Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const onSubmit = async () => {
    let updatePattern = {};
    if (transcript.toLowerCase().trim() === word.words.word.toLowerCase()) {
      updatePattern = { step: 8 };
    } else {
      updatePattern = { show_first_step: true };
    }

    const { data, error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev) =>
      transcript.toLowerCase().trim() === word.words.word.toLowerCase()
        ? prev + 1
        : prev - 1,
    );
  };

  const handleMouseDown = () => {
    SpeechRecognition.startListening();
  };

  const handleMouseUp = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Pronounce the word: {word.words.word}
        </CardTitle>
        <CardDescription>
          Hold the button below and pronounce the word clearly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-center">
          <Button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex items-center gap-2 ${listening ? "animate-pulse" : ""}`}
            style={listening ? { animation: `${pulse} 1s infinite` } : {}}
          >
            <SpeakerLoudIcon className="w-5 h-5" />
            {listening ? "Listening..." : "Hold to Pronounce"}
          </Button>
        </div>
        <p className="mt-4">
          Spoken word:{" "}
          <span className="font-bold">{transcript.toLowerCase().trim()}</span>
        </p>
        <Separator className="my-4" />
        <Button onClick={submitted ? onNext : onSubmit} className="w-full">
          {submitted ? "Next" : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step7;
