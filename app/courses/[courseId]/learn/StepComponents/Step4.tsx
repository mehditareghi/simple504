import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Step4Props {
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
  setCorrectAnswers: (correctAnswers: number) => void;
}

const supabase = createClient();

const Step4: FC<Step4Props> = ({
  word,
  onNext,
  courseId,
  setCorrectAnswers,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
      updatePattern = { step: 5 };
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

  const selectExample = (examples: string[], word: string): string => {
    for (let example of examples) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(example)) {
        return example.replace(word, "______");
      }
    }
    return examples[0].replace(word, "______");
  };

  const example = selectExample(word.examples, word.word);

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
      <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
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
    <Card className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <span>Complete the Sentence</span>
        </CardTitle>
        <CardDescription>
          Select the correct word to complete the sentence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">{example}</p>
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selectedOption === option ? "bg-gray-100" : ""
              } ${
                submitted &&
                (option === correctOption
                  ? "bg-green-100"
                  : selectedOption === option
                    ? "bg-red-100"
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

export default Step4;
