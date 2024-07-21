"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Step1 from "./StepComponents/Step1";
import Step2 from "./StepComponents/Step2";
import Step3 from "./StepComponents/Step3";
import Step4 from "./StepComponents/Step4";
import Step5 from "./StepComponents/Step5";
import Step6 from "./StepComponents/Step6";
import Step7 from "./StepComponents/Step7";
import Step8 from "./StepComponents/Step8";
import Step9 from "./StepComponents/Step9";

const getNextWord = async (userId: string, courseId: string) => {
  const response = await fetch("/api/words/get-next-word", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!response.ok) {
    throw new Error("Failed to get the next word");
  }

  return response.json();
};

interface LearningSessionProps {
  userId: string;
  courseId: string;
  sessionLength: number;
  firstWord: any;
}

export default function LearningSession({
  userId,
  courseId,
  sessionLength,
  firstWord,
}: LearningSessionProps) {
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentWord, setCurrentWord] = useState(firstWord);
  const [currentStep, setCurrentStep] = useState(
    firstWord.show_first_step ? 1 : firstWord.step,
  );
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setProgress((correctAnswers / sessionLength) * 100);
  }, [correctAnswers]);

  const handleNextStep = async () => {
    try {
      const nextWordData = await getNextWord(userId, courseId);
      setCurrentWord(nextWordData);
      setCurrentStep(nextWordData.show_first_step ? 1 : nextWordData.step);
    } catch (error) {
      console.error("Failed to fetch the next word:", error);
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setShowResult(true), 1500);
    }
  }, [progress]);

  const renderCurrentStep = () => {
    if (!currentWord) return null;

    // Check if show_first_step is true and render step 1
    if (currentWord.show_first_step) {
      return (
        <Step1
          word={currentWord}
          onNext={handleNextStep}
          setCorrectAnswers={setCorrectAnswers}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1
            word={currentWord}
            onNext={handleNextStep}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 2:
        return (
          <Step2
            word={currentWord}
            onNext={handleNextStep}
            courseId={courseId}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 3:
        return (
          <Step3
            word={currentWord}
            onNext={handleNextStep}
            courseId={courseId}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 4:
        return (
          <Step4
            word={currentWord}
            onNext={handleNextStep}
            courseId={courseId}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 5:
        return (
          <Step5
            word={currentWord}
            onNext={handleNextStep}
            courseId={courseId}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 6:
        return (
          <Step6
            word={currentWord}
            onNext={handleNextStep}
            courseId={courseId}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 7:
        return (
          <Step7
            word={currentWord}
            onNext={handleNextStep}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 8:
        return (
          <Step8
            word={currentWord}
            onNext={handleNextStep}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      case 9:
        return (
          <Step9
            word={currentWord}
            onNext={handleNextStep}
            setCorrectAnswers={setCorrectAnswers}
          />
        );
      // Add other cases for different steps
      default:
        return null;
    }
  };

  if (!currentWord) return <div>No words available for this session</div>;

  if (showResult)
    return (
      <div className="text-center mt-10">
        <p className="text-xl font-bold">Well done! You did it.</p>
        <p>Now you can go to the course page and see your overall progress.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Learning Session
      </h1>
      <Progress
        value={progress}
        className={`h-4 rounded ${progress === 100 ? "bg-green-500" : progress > 0 ? "bg-orange-500" : "bg-gray-300"}`}
      />
      <div className="text-right text-gray-500">
        {Math.round(progress)}% completed
      </div>
      {renderCurrentStep()}
    </div>
  );
}
