import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Modal } from "@components/ui/common";
import Message from "@components/ui/common/message";
import { Curriculum, CourseHero, KeyPoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

/* eslint-disable @next/next/no-img-element */
function Course({ course }) {
  const { isLoading } = useWeb3();
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account?.data);
  const courseState = ownedCourse?.data?.state;
  //const courseState = "activated";

  const isLocked =
    !courseState ||
    courseState === "purchased" ||
    courseState === "deactivated";

  return (
    <>
      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedCourse?.data}
          title={course?.title}
          description={course?.description}
          image={course?.coverImage}
        />
      </div>
      <KeyPoints points={course?.wsl} />

      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "purchased" && (
            <Message type="warning">
              Course is purchased and awaiting for activation. Process can take
              upto 24 hours.
              <i className="block font-normal">
                In case of any questions, please contact
                <strong>support@ethereummarket.io</strong>
              </i>
            </Message>
          )}

          {courseState === "activated" && (
            <Message type="success">
              <strong className="italic">Stella Mayers</strong> wishes you happy
              watching of the course.
            </Message>
          )}

          {courseState === "deactivated" && (
            <Message type="danger">
              Course has been{" "}
              <strong>deactivated due to incorrect purchase data</strong>. The
              functionality to watch the course has been temporarily disabled.
              <i className="block font-normal">
                Please contact
                <strong>support@ethereummarket.io</strong>
              </i>
            </Message>
          )}
        </div>
      )}

      <Curriculum
        isLoading={isLoading}
        locked={isLocked}
        courseState={courseState}
      />
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
