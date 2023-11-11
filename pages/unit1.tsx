import { unit1 } from '../data';
import { PlayCircle } from 'phosphor-react';

const Page = () => {
  const speakUS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find((voice) => voice.lang === 'en-US');
    if (usVoice) utterance.voice = usVoice;
    window.speechSynthesis.speak(utterance);
  };

  const speakUK = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((voice) => voice.lang === 'en-GB');
    if (ukVoice) utterance.voice = ukVoice;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-center text-orange-500 mb-4'>Unit 1</h1>
      {unit1.map((word, index) => (
        <details key={index} className='mb-4'>
          <summary className='flex items-center font-medium'>
            <p className='mr-2 px-4 py-2 rounded-lg bg-gray-100 text-orange-500'>{word.row}</p>
            <p className='bg-gray-100 px-4 py-2 rounded-lg w-full'>{word.word}</p>
          </summary>
          <div className='pl-4 bg-orange-50 rounded-lg px-4 py-2 mt-2'>
            <div className='flex items-center'>
              <strong className='text-orange-500'>US:</strong>
              <button onClick={() => speakUS(word.word)} className='flex items-center justify-center text-lg ml-1'>
                <PlayCircle weight='fill' />
              </button>
            </div>
            <div className='flex items-center'>
              <strong className='text-orange-500'>UK:</strong>
              <button onClick={() => speakUK(word.word)} className='flex items-center justify-center text-lg ml-1'>
                <PlayCircle weight='fill' />
              </button>
            </div>

            <p>
              <strong className='text-orange-500'>Part of Speech:</strong> {word.partOfSpeech.join(', ')}
            </p>
            {word.noun.length > 0 && (
              <p>
                <strong className='text-orange-500'>Noun:</strong> {word.noun.join(', ')}
              </p>
            )}
            {word.verb.length > 0 && (
              <p>
                <strong className='text-orange-500'>Verb:</strong> {word.verb.join(', ')}
              </p>
            )}
            {word.adjective.length > 0 && (
              <p>
                <strong className='text-orange-500'>Adjective:</strong> {word.adjective.join(', ')}
              </p>
            )}
            {word.adverb.length > 0 && (
              <p>
                <strong className='text-orange-500'>Adverb:</strong> {word.adverb.join(', ')}
              </p>
            )}
            <p>
              <strong className='text-orange-500'>Definition:</strong> {word.definition.join(', ')}
            </p>
            <p>
              <strong className='text-orange-500'>Example:</strong>
            </p>
            <ol className='list-lower-alpha list-inside'>
              {word.example.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ol>
            {word.note.length > 0 && (
              <p>
                <strong className='text-orange-500'>Note:</strong> {word.note.join(', ')}
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default Page;
