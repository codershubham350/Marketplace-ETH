/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import {
  useAccount,
  useOwnedCourses,
  useWalletInfo,
} from "@components/hooks/web3";
import { Button, Loader } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderModal } from "@components/ui/order";
import { getAllCourses } from "@content/courses/fetcher";
import { useWeb3 } from "@components/providers";
import { withToast } from "@utils/toast";
import { mutate } from "swr";

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [busyCourseId, setBusyCourseId] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const { hasConnectedWallet, account, isConnecting } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const purchaseCourse = async (order, course) => {
    setBusyCourseId(course.id);
    const hexCourseId = web3.utils.utf8ToHex(course.id);

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

    // Proof
    // emailhash + orderHash
    // d4fa46589443674848832a74ea3731f178812de3c6c7fa7042a3c58a6caa3a1e26e36f30d4f21af0b9804d7420705ebd4bad59a71965d20a2371c89b31994b9c
    // keccack256 hex of (d4fa46589443674848832a74ea3731f178812de3c6c7fa7042a3c58a6caa3a1e26e36f30d4f21af0b9804d7420705ebd4bad59a71965d20a2371c89b31994b9c) -> 639e67994aeb5798fc8458262c730775fab19e57df64e8f37dcd8f7494b52feb (proof)
    // console.log("proof", proof);
    const value = web3.utils.toWei(String(order.price));

    if (isNewPurchase) {
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
      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const _repurchaseCourse = async ({ courseHash, value }, course) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });

      const index = ownedCourses.data.findIndex((c) => c.id === course.id);

      if (index >= 0) {
        ownedCourses.data[index].state = "purchased";
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses?.lookup[course?.id];
          return (
            <CourseCard
              disabled={!hasConnectedWallet}
              key={course.id}
              state={owned?.state}
              course={course}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses?.hasInitialResponse) {
                  // return <div style={{ height: "42px" }}></div>;
                  return (
                    <Button disabled={true} size="sm" variant="white">
                      {hasConnectedWallet ? " Loading State..." : "Connect"}
                    </Button>
                  );
                }

                const isBusy = busyCourseId === course?.id;
                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          size="sm"
                          disabled={false}
                          variant="white"
                          onClick={() => alert("You are owner of this course")}
                        >
                          Yours &#10004;
                        </Button>
                        {owned?.state === "deactivated" && (
                          <div className="ml-1">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              variant="purple"
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                            >
                              {isBusy ? (
                                <div className="flex">
                                  <Loader size="sm" />
                                  <div className="ml-2">In Progress</div>
                                </div>
                              ) : (
                                <div>Fund to Activate</div>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }
                return (
                  <Button
                    size="sm"
                    disabled={!hasConnectedWallet || isBusy}
                    onClick={() => setSelectedCourse(course)}
                    variant="lightPurple"
                  >
                    {isBusy ? (
                      <div className="flex">
                        <Loader size="sm" />
                        <div className="ml-2">In Progress</div>
                      </div>
                    ) : (
                      <div>Purchase</div>
                    )}
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={() => {
            cleanupModal;
          }}
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
