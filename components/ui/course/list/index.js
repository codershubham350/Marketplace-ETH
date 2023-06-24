// Array.from({length:4}) -> created 4 undefined items
// import { CourseCard } from "@components/ui/course";

const List = ({ courses, children }) => {
  return (
    <>
      <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {courses.map((course) => children(course))}
        {/* <CourseCard key={course.id} course={course} /> */}
      </section>
    </>
  );
};

export default List;
