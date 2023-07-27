import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { MarketHeader } from "../../../components/ui/marketplace/header";
import { BaseLayout } from "@components/ui/layout";
import { Button } from "@components/ui/common";
import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useState } from "react";
import { useWeb3 } from "@components/providers";
import Message from "@components/ui/common/message";

// Before TX Balance ->  56.640841624979713552
// GAS 139809 * 1000000008 -> 139809001118472 -> 0.000139809001118472
// GAS + VALUE SEND = 0.000139809001118472 + 1 -> 1.000139809001118472
// After TX Balance -> 55.64070182
// After TX Balance->  55.640701815978595080
//                     56.640664324978295152 (After Deactivation)

const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        type="text"
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default function ManagedCourses() {
  const [proofedOwnership, setProofedOwnership] = useState({});
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const { managedCourses } = useManagedCourses(account);

  const verifyCourse = (email, { hash: courseHash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      {
        type: "bytes32",
        value: emailHash,
      },
      {
        type: "bytes32",
        value: courseHash,
      }
    );

    proofToCheck === proof
      ? setProofedOwnership({ ...proofedOwnership, [courseHash]: true })
      : setProofedOwnership({ ...proofedOwnership, [courseHash]: false });
  };

  const changeCourseState = async (courseHash, method) => {
    try {
      await contract.methods[method](courseHash).send({ from: account?.data });
    } catch (e) {
      console.error(e.message);
    }
  };

  const activateCourse = async (courseHash) => {
    changeCourseState(courseHash, "activateCourse");
  };

  if (!account?.isAdmin) {
    return null;
  }

  const deactivateCourse = async (courseHash) => {
    changeCourseState(courseHash, "deactivateCourse");
  };

  if (!account?.isAdmin) {
    return null;
  }

  return (
    <>
      <MarketHeader />
      <CourseFilter />
      <section className="grid grid-cols-1">
        {managedCourses?.data?.map((course) => (
          <ManagedCourseCard key={course?.ownedCourseId} course={course}>
            <VerificationInput
              onVerify={(email) => {
                verifyCourse(email, {
                  hash: course?.hash,
                  proof: course?.proof,
                });
              }}
            />
            {proofedOwnership[course?.hash] && (
              <div className="mt-2">
                <Message>Verified!</Message>
              </div>
            )}
            {proofedOwnership[course?.hash] === false && (
              <div className="mt-2">
                <Message type="danger">Wrong Proof!</Message>
              </div>
            )}
            {course?.state === "purchased" && (
              <div className="mt-2">
                <Button
                  variant="green"
                  onClick={() => activateCourse(course?.hash)}
                >
                  Activate
                </Button>
                <Button
                  variant="red"
                  onClick={() => deactivateCourse(course?.hash)}
                >
                  Deactivate
                </Button>
              </div>
            )}
          </ManagedCourseCard>
        ))}
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;
