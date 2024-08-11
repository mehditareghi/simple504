import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { keyframes } from "@stitches/react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Step5Props {
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
  courseId: string;
  setCorrectAnswers: Dispatch<SetStateAction<number>>;
}

const supabase = createClient();

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

const Step5: FC<Step5Props> = ({
  word,
  onNext,
  courseId,
  setCorrectAnswers,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    const fetchOtherWords = async () => {
      try {
        const { data, error } = await supabase
          .from("random_words")
          .select("word")
          .eq("course_id", courseId)
          .neq("word", word.word)
          .limit(3);

        if (error) {
          console.error("Error fetching other words:", error);
          return;
        }

        const otherWords = data.map((w: { word: string }) => w.word);
        const allOptions = [...otherWords, word.word];
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error("Error fetching other words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherWords();
  }, [courseId, word]);

  const onSubmit = async () => {
    const isCorrectAnswer = selectedOption === word.word;
    setIsCorrect(isCorrectAnswer);
    let updatePattern = {};

    if (isCorrectAnswer) {
      updatePattern = { step: 6 };
      setCorrectOption(selectedOption);
    } else {
      updatePattern = { show_first_step: true };
      setCorrectOption(word.word);
    }

    const { error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev) => (isCorrectAnswer ? prev + 1 : prev - 1));

    if (isCorrectAnswer) {
      setShowProgressBar(true);
    }
  };

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
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

  if (loading) {
    return (
      <Card className="p-6 rounded-lg shadow-lg space-y-4">
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-300 animate-pulse h-10 w-3/4 mx-auto rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <span>Listen to the Pronunciation and Select the Correct Word</span>
        </CardTitle>
        <CardDescription>
          Click the speaker icon below to hear the word, then select the correct
          word from the options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={handlePlayAudio}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <SpeakerLoudIcon
              className={`w-8 h-8 ${isSpeaking ? "animate-pulse" : ""}`}
              style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
            />
          </button>
        </div>
        <div className="space-y-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left py-2 px-4 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selectedOption === option
                  ? "bg-slate-100 dark:bg-slate-900"
                  : ""
              } ${
                submitted &&
                (option === correctOption
                  ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
                  : selectedOption === option
                    ? "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700"
                    : "")
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
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
              className="w-full bg-yellow-400 dark:bg-yellow-600"
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
            disabled={!selectedOption}
          >
            Submit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Step5;
