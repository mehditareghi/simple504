interface Word {
  word_id: string;
  user_id: string;
  step: number;
  show_first_step: boolean;
  course_id: string;
  word: string;
  definitions: string[];
  examples: string[];
  note: string;
}

export const getNextWord = (userWords: Word[]): Word | null => {
  if (userWords.length === 0) {
    return null;
  }
  // Check if there is a word with show_first_step true and return it
  const showFirstStepWord = userWords.find((word) => word.show_first_step);
  if (showFirstStepWord) {
    return showFirstStepWord;
  }

  // Check if all steps are the same
  const allStepsSame = userWords.every(
    (word) => word.step === userWords[0].step,
  );

  if (allStepsSame) {
    // Return the record with the lowest order
    return userWords[0];
  }

  // Check if there is a word with step 4 and no words with step 2 or 3
  const step4Word = userWords.find((word) => word.step === 4);
  const step2or3Word = userWords.find(
    (word) => word.step === 2 || word.step === 3,
  );
  if (step4Word && !step2or3Word) {
    const step1Words = userWords.filter((word) => word.step === 1);
    if (step1Words.length > 0) {
      return step1Words[0];
    }
  }

  // Check the condition for step differences without filtering out step 1 words
  for (let i = 0; i < userWords.length; i++) {
    const currentWord = userWords[i];
    for (let j = i + 1; j < userWords.length; j++) {
      const nextWord = userWords[j];
      if (currentWord.step + 1 - nextWord.step <= 3) {
        return currentWord;
      }
    }
  }

  // If no word meets the condition, return the first word with step 1
  const step1Word = userWords.find((word) => word.step === 1);
  if (step1Word) {
    return step1Word;
  }

  // If no step 1 word exists, return the first word in sorted order
  return userWords[0];
};

export const getSessionLength = (userWords: Word[]): number => {
  if (userWords.length === 12) {
    return 12;
  }

  // Calculate the possible session length
  let sessionLength = userWords.reduce(
    (sum, word) => sum + (10 - word.step),
    0,
  );

  // Add 1 for each word with show_first_step set to true
  const showFirstStepCount = userWords.filter(
    (word) => word.show_first_step,
  ).length;
  sessionLength += showFirstStepCount;

  // Limit the session length to a maximum of 12
  sessionLength = sessionLength > 12 ? 12 : sessionLength;

  return sessionLength;
};
