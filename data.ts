interface Unit {
  row: number;
  word: string;
  partOfSpeech: string[];
  noun: string[];
  verb: string[];
  adjective: string[];
  adverb: string[];
  definition: string[];
  example: string[];
  note: string[];
}

export const unit1: Unit[] = [
  {
    row: 1,
    word: 'abandon',
    partOfSpeech: ['verb'],
    noun: ['abandonment'],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['desert', 'leave without planning to come back', 'quit'],
    example: [
      `When Roy abandoned his family, the police went looking for him.`,
      `The soldier could not abandon his friends who were hurt in battle.`,
      `Because Rose was poor, she had to abandon her idea of going to college.`,
    ],
    note: [],
  },
  {
    row: 2,
    word: 'keen',
    partOfSpeech: ['adjective'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['sharp', 'eager', 'intense', 'sensitive'],
    example: [
      `The butcher's keen knife cut through the meat.`,
      `My dog has a keen sense of smell.`,
      `Bill's keen mind pleased all his teachers.`,
    ],
    note: ['keen on === interested in'],
  },
  {
    row: 3,
    word: 'jealous',
    partOfSpeech: ['adjective'],
    noun: ['jealousy'],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['afraid that the one you love might prefer someone else', 'wanting what someone else has'],
    example: [
      `A detective was hired by the jealous widow to find the boyfriend
who had abandoned* her.`,
      `Although my neighbor just bought a new car, I am not jealous of
him.`,
      ` Being jealous, Mona would not let her boyfriend dance with any of
the cheerleaders. `,
    ],
    note: ['always with of'],
  },
  {
    row: 4,
    word: 'tact',
    partOfSpeech: ['noun'],
    noun: [],
    verb: [],
    adjective: ['tactful', 'tactless'],
    adverb: [],
    definition: ['ability to say the right thing'],
    example: [
      `The butcher's keen knife cut through the meat.`,
      `My dog has a keen sense of smell.`,
      `Bill's keen mind pleased all his teachers.`,
    ],
    note: ['with use for verb'],
  },
  {
    row: 5,
    word: 'oath',
    partOfSpeech: ['noun'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['a promise that something is true', 'a curse'],
    example: [
      `The president will take the oath of office tomorrow.`,
      `In court, the witness took an oath that he would tell the whole truth.`,
      `When Terry discovered that he had been abandoned,* he let out an
angry oath.`,
    ],
    note: ['take the oath for president or special position, make an oath for normal people'],
  },
  {
    row: 6,
    word: 'vacant',
    partOfSpeech: ['adjective'],
    noun: ['vacancy'],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['empty', 'not filled'],
    example: [
      `Someone is planning to build a house on that vacant lot.`,
      `I put my coat on that vacant seat.`,
      `When the landlord broke in, he found that apartment vacant.`,
    ],
    note: [],
  },
  {
    row: 7,
    word: 'hardship',
    partOfSpeech: ['noun'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['something that is hard to bear', 'difficulty'],
    example: [
      `The fighter had to face many hardships before he became
champion.`,
      `Abe Lincoln was able to overcome one hardship after another.`,
      `On account of hardship, Bert was let out of the army to take care
of his sick mother.`,
    ],
    note: [],
  },
  {
    row: 8,
    word: 'gallant',
    partOfSpeech: ['adjective'],
    noun: ['gallantry'],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['brave', 'showing respect for women'],
    example: [
      `The pilot swore a gallant oath* to save his buddy.`,
      `Many gallant knights entered the contest to win the princess.`,
      `Ed is so gallant that he always gives up his subway seat to a woman.`,
    ],
    note: [],
  },
  {
    row: 9,
    word: 'data',
    partOfSpeech: ['noun'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['facts', 'information'],
    example: [
      `The data about the bank robbery were given to the F.B.I.`,
      `After studying the data, we were able to finish our report.`,
      `Unless you are given all the data, you cannot do the math problem.`,
    ],
    note: [],
  },
  {
    row: 10,
    word: 'unaccustomed',
    partOfSpeech: ['adjective'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['not used to something'],
    example: [
      `Coming from Alaska, Claude was unaccustomed to Florida's heat.`,
      `The king was unaccustomed to having people disobey him.`,
      `Unaccustomed as he was to exercise, Vic quickly became tired.`,
    ],
    note: ['always with to'],
  },
  {
    row: 11,
    word: 'bachelor',
    partOfSpeech: ['noun'],
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
    definition: ['a man who has not married'],
    example: [
      `My brother took an oath* to remain a bachelor.`,
      `In the movie, the married man was mistaken for a bachelor.`,
      `Before the wedding, all his bachelor friends had a party.`,
    ],
    note: [],
  },
  {
    row: 12,
    word: 'qualify',
    partOfSpeech: ['verb'],
    noun: ['qualification', 'quality'],
    verb: [],
    adjective: ['qualified'],
    adverb: [],
    definition: ['become fit', 'show that you are able'],
    example: [
      `I am trying to qualify for the job that is now vacant.*`,
      `Since Pauline can't carry a tune, she is sure that she will never qualify for the Girls' Chorus.`,
      `You have to be taller than 5 1
5" to qualify as a policeman in our town.`,
    ],
    note: ['to qualify'],
  },
];
