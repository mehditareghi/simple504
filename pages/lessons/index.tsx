import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let lessons = null;

  try {
    const response = await fetch(`${API_URL}/lesson/lesson/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    lessons = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      lessons: lessons.results,
    },
  };
}

const Lessons = ({ lessons }) => {
  return (
    <div>
      <h1>Lessons</h1>
      <ul className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem , 100%), 1fr ))' }}>
        {lessons.map((lesson: any) => {
          return (
            <li
              key={lesson.id}
              className='flex gap-4 border border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-orange-100 hover:border-orange-500'
            >
              <div className='w-[20%]'>
                <Link href={`/lessons/${lesson.id}`}>
                  <Image src='/504.webp' width={225} height={225} alt='avatar' className='rounded-lg bg-gray-500' />
                </Link>
              </div>
              <div className='flex justify-between p-4 w-full rounded-lg'>
                <Link href={`/lessons/${lesson.id}`}>
                  <h3 className='font-medium text-lg'>{lesson.name}</h3>
                  <p>{lesson.units_count} Units</p>
                  <p>{lesson.words_count} Words</p>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lessons;
