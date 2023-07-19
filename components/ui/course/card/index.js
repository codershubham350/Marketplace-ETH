// Array.from({length:4}) -> created 4 undefined items
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";

const Card = ({ course, Footer, disabled }) => {
  const [descriptionLength, setDescriptionLength] = useState(70);
  const [showReadMore, setShowReadMore] = useState(true);

  const handleDescriptionLength = (course) => {
    setDescriptionLength(course?.description?.length);
    setShowReadMore(!showReadMore);
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
          <div className="flex-1 next-image-wrapper">
            <Image
              className={`object-cover ${disabled && "filter grayscale"}`}
              src={course?.coverImage}
              alt={course?.title}
              width={"200"}
              height={"230"}
              layout="responsive"
            />
          </div>
          <div className="p-8 pb-4 flex-2" style={{ height: "266px" }}>
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Case study
            </div>
            <Link
              href={`/courses/${course?.slug}`}
              className="h-12 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline"
            >
              {course?.title}
            </Link>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              {course?.description.substring(0, descriptionLength)}
              {showReadMore && (
                <span style={{ cursor: "pointer" }}>
                  <strong className="pl-2 text-blue-400">...</strong>
                  <strong
                    className=" text-blue-400"
                    style={{ textDecoration: "underline" }}
                    onClick={(course) => handleDescriptionLength(course)}
                  >
                    Read More!
                  </strong>
                </span>
              )}
            </p>
            {Footer && <Footer />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
