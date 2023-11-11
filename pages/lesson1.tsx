import { lesson1 } from '../data';

const Page = () => {
  return (
    <div className='p-4'>
      {lesson1.map((word, index) => (
        <details key={index} className='mb-4'>
          <summary className='flex items-center font-medium'>
            <p className='mr-2 px-4 py-2 rounded-lg bg-gray-100 text-orange-500'>{word.row}</p>
            <p className='bg-gray-100 px-4 py-2 rounded-lg w-full'>{word.word}</p>
          </summary>
          <div className='pl-4 bg-orange-50 rounded-lg px-4 py-2 mt-2'>
            <p>
              <strong>Part of Speech:</strong> {word.partOfSpeech.join(', ')}
            </p>
            {word.noun.length > 0 && (
              <p>
                <strong>Noun:</strong> {word.noun.join(', ')}
              </p>
            )}
            {word.verb.length > 0 && (
              <p>
                <strong>Verb:</strong> {word.verb.join(', ')}
              </p>
            )}
            {word.adjective.length > 0 && (
              <p>
                <strong>Adjective:</strong> {word.adjective.join(', ')}
              </p>
            )}
            {word.adverb.length > 0 && (
              <p>
                <strong>Adverb:</strong> {word.adverb.join(', ')}
              </p>
            )}
            <p>
              <strong>Definition:</strong> {word.definition.join(', ')}
            </p>
            <p>
              <strong>Example:</strong>
            </p>
            <ol className='list-lower-alpha list-inside'>
              {word.example.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ol>
            {word.note.length > 0 && (
              <p>
                <strong>Note:</strong> {word.note.join(', ')}
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default Page;
