/* eslint-disable @next/next/no-img-element */

import { Hero } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Home({ courses }) {
  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course) => <CourseCard key={course?.id} course={course} />}
      </CourseList>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: { courses: data },
  };
}

// export function getStaticProps() {
//   const { data } = getAllCourses();
//   const course = data.filter((c) => c.slug === params.slug[0]);
//   return {
//     props: { course },
//   };
// }

Home.Layout = BaseLayout;
