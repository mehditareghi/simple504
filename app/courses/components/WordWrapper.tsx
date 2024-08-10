"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  SpeakerLoudIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Word {
  id: string;
  word: string;
  definitions: string[];
  examples: string[];
}

interface WordWrapperProps {
  words: Word[];
}

export default function WordWrapper({ words }: WordWrapperProps) {
  const handlePlayAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  };

  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center w-full p-6 gap-6">
      <div className="flex flex-col w-full max-w-4xl gap-4">
        {words.map((word) => (
          <Card key={word.id} className="border rounded-lg shadow-sm">
            <CardHeader className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-xl font-semibold">
                  {word.word}
                </CardTitle>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(word.word);
                  }}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <SpeakerLoudIcon className="w-5 h-5" />
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedWordId(word.id === selectedWordId ? null : word.id)
                }
              >
                {word.id === selectedWordId ? (
                  <EyeClosedIcon className="w-5 h-5" />
                ) : (
                  <EyeOpenIcon className="w-5 h-5" />
                )}
              </Button>
            </CardHeader>
            {word.id === selectedWordId && (
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <p className="font-bold">Definitions:</p>
                    <ul className="list-disc list-inside pl-4">
                      {word.definitions.map((def) => (
                        <li key={def}>{def}</li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-bold">Examples:</p>
                    <ul className="list-disc list-inside pl-4">
                      {word.examples.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
