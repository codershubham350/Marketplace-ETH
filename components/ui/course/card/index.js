// Array.from({length:4}) -> created 4 undefined items
import Image from "next/legacy/image";
import Link from "next/link";

const Card = ({ course }) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
          <div className="flex h-full w-52">
            <Image
              className="object-cover"
              src={course?.coverImage}
              alt={course?.title}
              width={"200"}
              height={"230"}
              layout="fixed"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Case study
            </div>
            <Link
              href={`/courses/${course?.slug}`}
              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
            >
              {course?.title}
            </Link>
            <p className="mt-2 text-gray-500">{course?.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
