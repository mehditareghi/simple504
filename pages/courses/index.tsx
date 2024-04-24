import { API_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';

type Course = {
  id: number;
  units_count: number;
  words_count: number;
  name: string;
  created_at: string;
  updated_at: string;
};

type Res = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token; // assuming the token is stored in cookies

  let courses: Res | null = null;

  try {
    const response = await fetch(`${API_URL}/lesson/course/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    courses = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      courses: courses ? courses.results : [],
    },
  };
}

const Courses = ({ courses }: { courses: Course[] }) => {
  return (
    <div>
      <h1 className='H1'>Courses</h1>
      <ul className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem , 100%), 1fr ))' }}>
        {courses.map((course: any) => {
          return (
            <li key={course.id} className=''>
              <Link
                href={`/courses/${course.id}`}
                className='block grid gap-4 border border-slate5 p-4 rounded-lg bg-slate3 hover:bg-accent5 hover:border-accent8 transition duration-100 ease-in-out transform hover:scale-102 shadow'
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(15rem, 100%), 1fr))' }}
              >
                <div className='flex justify-between p-4 w-full rounded-lg'>
                  <div>
                    <h2 className='H2'>{course.name}</h2>
                    <p>{course.units_count} Units</p>
                    <p>{course.words_count} Words</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Courses;
