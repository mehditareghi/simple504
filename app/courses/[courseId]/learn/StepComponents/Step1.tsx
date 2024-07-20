import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { keyframes } from "@stitches/react";
import { createClient } from "@/utils/supabase/client";

interface Step1Props {
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

const Step1: FC<Step1Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  console.log(word);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.words.word);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.speak(utterance);
  };

  const onSubmit = async () => {
    let updatePattern = {};
    if (word.show_first_step) {
      updatePattern = { show_first_step: false };
    } else {
      updatePattern = { step: 2 };
    }
    const { data, error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev) => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center space-x-2">
            <span>{word.words.word}</span>
            <button
              onClick={handlePlayAudio}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              <SpeakerLoudIcon
                className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`}
                style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
              />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <CardDescription className="font-bold">
              Definitions:
            </CardDescription>
            <ul className="list-disc list-inside">
              {word.words.definitions.map((def) => (
                <li key={def}>{def}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <CardDescription className="font-bold">Examples:</CardDescription>
            <ul className="list-disc list-inside">
              {word.words.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <Button onClick={submitted ? onNext : onSubmit} className="w-full">
            {submitted ? "Next" : "Understood"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;
