import { OwnedCourseCard } from "@components/ui/course";
import { MarketHeader } from "../../../components/ui/marketplace/header";
import { BaseLayout } from "@components/ui/layout";
import { Button } from "@components/ui/common";
import Message from "@components/ui/common/message";

export default function OwnedCourses() {
  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <section className="grid grid-cols-1">
        <OwnedCourseCard>
          <Message>My custom message!</Message>
          <Button>Watch the course</Button>
        </OwnedCourseCard>
      </section>
    </>
  );
}

OwnedCourses.Layout = BaseLayout;
