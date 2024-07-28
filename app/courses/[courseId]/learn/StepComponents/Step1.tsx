import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpeakerLoudIcon, Cross2Icon } from "@radix-ui/react-icons";
import { keyframes } from "@stitches/react";
import { createClient } from "@/utils/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Step1Props {
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

const Step1: FC<Step1Props> = ({ word, onNext, setCorrectAnswers }) => {
  const supabase = createClient();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.speak(utterance);
  };

  const onIgnore = async () => {
    const { error } = await supabase
      .from("user_word_progress")
      .update({ completed: true })
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error marking word as completed", error);
    }
    setSubmitted(true);
  };

  const onSubmit = async () => {
    let updatePattern = {};
    if (word.show_first_step) {
      updatePattern = { show_first_step: false };
    } else {
      updatePattern = { step: 2 };
    }
    const { error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev: number) => prev + 1);
  };

  useEffect(() => {
    if (submitted) {
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
  }, [submitted, onNext]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <span className={submitted ? "text-green-500" : ""}>
                {word.word}
              </span>
              <button
                onClick={handlePlayAudio}
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                <SpeakerLoudIcon
                  className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`}
                  style={
                    isSpeaking ? { animation: `${pulse} 1s infinite` } : {}
                  }
                />
              </button>
            </div>
            {!word.show_first_step && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onIgnore}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <Cross2Icon className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    Ignore this word
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
              {word.definitions.map((def) => (
                <li key={def}>{def}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <CardDescription className="font-bold">Examples:</CardDescription>
            <ul className="list-disc list-inside">
              {word.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
          <Separator />
          {submitted ? (
            <Progress value={progress} className="w-full bg-green-500" />
          ) : (
            <Button onClick={onSubmit} className="w-full">
              Understood
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;
