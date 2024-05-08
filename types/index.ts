export type Word = {
  id: number;
  word: string;
  part_of_speech: string;
  definition: string;
  examples: string;
  image: string;
  adjective: string;
  noun: string;
  unit: number;
  created_at: string;
  updated_at: string;
};

type Metadata = {
  max_correct: number;
  max_session: number;
  correct: number;
  incorrect: number;
  learn_id: Number;
};

export type Question = {
  question: string;
  study_type: 'intro' | 'card' | 'listening' | 'writing';
  next_url: string;
  words: Word[];
  answer: Word;
  metadata: Metadata;
};
