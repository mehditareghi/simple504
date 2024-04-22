import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

type Unit = {
  id: number;
  words_count: number;
  name: string;
  audio: string;
  course: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { courseId } = context.query;
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let units: Unit[] | null = null;

  try {
    const response = await fetch(`${API_URL}/lesson/course/${courseId}/units/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    units = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      units,
    },
  };
}

const Units = ({ units }: {units: Unit[]}) => {
  const router = useRouter();
  const { courseId } = router.query;

  return (
    <div>
      <h1 className='H1'>Units</h1>
      <ul className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem , 100%), 1fr ))' }}>
        {units.map((unit: any) => {
          return (
            <li
              key={unit.id}
              className='flex gap-4 border border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-orange-100 hover:border-orange-500 shadow'
            >
              <div className='flex justify-between p-4 w-full rounded-lg'>
                <Link href={`/courses/${courseId}/${unit.id}`}>
                  <h2 className='H2'>{unit.name}</h2>
                  <p>{unit.description}</p>
                  <p>{unit.words_count} Words</p>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Units;
