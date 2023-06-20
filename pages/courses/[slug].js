import { Modal } from "@components/ui/common";
import { Curriculum, CourseHero, KeyPoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

/* eslint-disable @next/next/no-img-element */
function Course({ course }) {
  return (
    <>
      <div className="py-4">
        <CourseHero
          title={course?.title}
          description={course?.description}
          image={course?.coverImage}
        />
      </div>
      <KeyPoints points={course?.wsl} />
      <Curriculum locked={true} />
      <Modal />
    </>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((course) => ({
      params: {
        slug: course.slug,
      },
    })),
    fallback: false,
  };
}
export function getStaticProps({ params }) {
  const { data } = getAllCourses();

  const course = data.filter((c) => c.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;

export default Course;
