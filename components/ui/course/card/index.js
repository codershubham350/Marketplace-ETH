// Array.from({length:4}) -> created 4 undefined items
import { useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { AnimateKeyframes } from "react-simple-animate";

const Card = ({ course, Footer, disabled, state }) => {
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
          <div className="p-8 pb-4 flex-2">
            <div className="flex items-center">
              <div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
                {course.type}
              </div>
              <div>
                {state === "activated" && (
                  <div
                    className="text-xs text-black bg-green-200 p-1 px-3 rounded-full"
                    size="sm"
                  >
                    Activated
                  </div>
                )}
                {state === "deactivated" && (
                  <div
                    className="text-xs text-black bg-red-200 p-1 px-3 rounded-full"
                    size="sm"
                    type="danger"
                  >
                    Deactivated
                  </div>
                )}
                {state === "purchased" && (
                  <AnimateKeyframes
                    play
                    duration={2}
                    keyframes={["opacity: 0.2", "opacity: 1"]}
                    iterationCount="infinite"
                  >
                    <div
                      className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full"
                      size="sm"
                      type="danger"
                    >
                      Pending
                    </div>
                  </AnimateKeyframes>
                )}
              </div>
            </div>
            <Link
              href={`/courses/${course?.slug}`}
              className="h-12 block mt-1 text-sm sm:text-base leading-tight font-medium text-black hover:underline"
            >
              {course?.title}
            </Link>
            <p className="mt-2 mb-4 text-sm sm:text-base text-gray-500">
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
            {Footer && (
              <div className="mt-2">
                <Footer />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
