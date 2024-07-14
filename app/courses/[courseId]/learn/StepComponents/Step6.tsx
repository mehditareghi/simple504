import { FC, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { keyframes } from '@stitches/react';

interface Step6Props {
  word: {
    id: string;
    word: string;
    definitions: string[];
    examples: string[];
  };
  onAnswer: (correct: boolean) => void;
  courseId: string;
}

const supabase = createClient();

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.8 },
});

const Step6: FC<Step6Props> = ({ word, onAnswer, courseId }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchOtherDefinitions = async () => {
      try {
        const { data, error } = await supabase
          .from('words')
          .select(`word, definitions, units!inner(course_id)`)
          .filter('units.course_id', 'eq', courseId)
          .neq('word', word.word)
          .limit(3);

        if (error) {
          console.error('Error fetching other definitions:', error);
          return;
        }

        // Extract definitions from the fetched words
        const otherDefinitions = data.map((w: { definitions: string[] }) => w.definitions.join('; '));

        // Select three random definitions from the other words
        const incorrectDefinitions = otherDefinitions.sort(() => 0.5 - Math.random());

        // Combine the correct definition with the incorrect ones
        const allOptions = [...incorrectDefinitions, word.definitions.join('; ')];

        // Shuffle the options
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error('Error fetching other definitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherDefinitions();
  }, [courseId, word]);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.speak(utterance);
  };

  const handleAnswer = (selectedOption: string) => {
    onAnswer(selectedOption === word.definitions.join('; '));
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
          <span>Listen to the Pronunciation and Select the Correct Definition</span>
        </CardTitle>
        <CardDescription>Click the speaker icon below to hear the word, then select the correct definition from the options.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={handlePlayAudio}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <SpeakerLoudIcon
              className={`w-8 h-8 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={isSpeaking ? { animation: `${pulse} 1s infinite` } : {}}
            />
          </button>
        </div>
        <div className="space-y-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswer(option)}
              className="w-full text-left py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step6;