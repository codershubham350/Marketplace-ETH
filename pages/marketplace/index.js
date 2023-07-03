/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useWalletInfo } from "@components/hooks/web3";
import { Button } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderModal } from "@components/ui/order";
import { getAllCourses } from "@content/courses/fetcher";
import { useWeb3 } from "@components/providers";

export default function Marketplace({ courses }) {
  const { web3, contract } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { canPurchaseCourse, account } = useWalletInfo();

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

    // console.log("hexCourseId", hexCourseId);

    // HexCourseID
    // 0x31343130343734 (Hex value of course ID)
    // Value of Hex Course ID (32 byte)
    // 0x31343130343734000000000000000000

    const orderHash = web3?.utils?.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    // OrderHash
    // address
    // Account 4- 0x8c18f123086196a5fC9956b1B27d6859280E14F0
    // Hex Course ID + address
    // 313431303437340000000000000000008c18f123086196a5fC9956b1B27d6859280E14F0

    // 313431303437340000000000000000008c18f123086196a5fC9956b1B27d6859280E14F0 (keccak256 hex) -> 26e36f30d4f21af0b9804d7420705ebd4bad59a71965d20a2371c89b31994b9c (orderHash)
    // console.log("orderHash", orderHash);

    const emailHash = web3.utils.sha3(order.email);

    // EmailHash
    // Keccak256 Text of admin@natours.io -> d4fa46589443674848832a74ea3731f178812de3c6c7fa7042a3c58a6caa3a1e (emailHash)
    // console.log("emailHash", emailHash);

    const proof = web3?.utils?.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    );

    // Proof
    // emailhash + orderHash
    // d4fa46589443674848832a74ea3731f178812de3c6c7fa7042a3c58a6caa3a1e26e36f30d4f21af0b9804d7420705ebd4bad59a71965d20a2371c89b31994b9c
    // keccack256 hex of (d4fa46589443674848832a74ea3731f178812de3c6c7fa7042a3c58a6caa3a1e26e36f30d4f21af0b9804d7420705ebd4bad59a71965d20a2371c89b31994b9c) -> 639e67994aeb5798fc8458262c730775fab19e57df64e8f37dcd8f7494b52feb (proof)
    // console.log("proof", proof);
    const value = web3.utils.toWei(String(order.price));
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      // console.log("result", result);
    } catch {
      console.error("Purchase course: Operation has failed!");
    }
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            disabled={!canPurchaseCourse}
            key={course.id}
            course={course}
            Footer={() => (
              <div className="mt-4 ">
                <Button
                  disabled={!canPurchaseCourse}
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
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

Marketplace.Layout = BaseLayout;
