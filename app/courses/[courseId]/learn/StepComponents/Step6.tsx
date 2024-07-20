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
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { keyframes } from "@stitches/react";
import { Separator } from "@/components/ui/separator";

interface Step6Props {
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
  courseId: string;
  setCorrectAnswers: (correctAnswers: number) => void;
}

const supabase = createClient();

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

const Step6: FC<Step6Props> = ({
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

  useEffect(() => {
    const fetchOtherDefinitions = async () => {
      try {
        const { data, error } = await supabase
          .from("random_words")
          .select(`word, definitions, course_id`)
          .eq("course_id", courseId)
          .neq("word", word.words.word)
          .limit(3);

        if (error) {
          console.error("Error fetching other definitions:", error);
          return;
        }

        const otherDefinitions = data.map((w: { definitions: string[] }) =>
          w.definitions.join("; "),
        );

        const incorrectDefinitions = otherDefinitions.sort(
          () => 0.5 - Math.random(),
        );

        const allOptions = [
          ...incorrectDefinitions,
          word.words.definitions.join("; "),
        ];

        setOptions(allOptions.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error("Error fetching other definitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherDefinitions();
  }, [courseId, word]);

  const onSubmit = async () => {
    let updatePattern = {};
    const isCorrect = selectedOption === word.words.definitions.join("; ");
    if (isCorrect) {
      updatePattern = { step: 7 };
      setCorrectOption(selectedOption);
    } else {
      updatePattern = { show_first_step: true };
      setCorrectOption(word.words.definitions.join("; "));
    }

    const { error } = await supabase
      .from("user_word_progress")
      .update(updatePattern)
      .match({ word_id: word.word_id, user_id: word.user_id });
    if (error) {
      console.error("Error updating user_word_progress", error);
    }
    setSubmitted(true);
    setCorrectAnswers((prev) => (isCorrect ? prev + 1 : prev - 1));
  };

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.words.word);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
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
          <span>
            Listen to the Pronunciation and Select the Correct Definition
          </span>
        </CardTitle>
        <CardDescription>
          Click the speaker icon below to hear the word, then select the correct
          definition from the options.
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
        <Button
          onClick={submitted ? onNext : onSubmit}
          className="w-full"
          disabled={!selectedOption}
        >
          {submitted ? "Next" : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step6;
