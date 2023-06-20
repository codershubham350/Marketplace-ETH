import courses from "./index.json";

export const getAllCourses = () => {
  return {
    data: courses,
    courseMap: courses.reduce((acc, cur, ind) => {
      acc[cur.id] = cur;
      acc[cur.id].index = ind;
      return acc;
    }, {}),
  };
};
