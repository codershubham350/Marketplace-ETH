import { OwnedCourseCard } from "@components/ui/course";
import { MarketHeader } from "../../../components/ui/marketplace/header";
import { BaseLayout } from "@components/ui/layout";

export default function OwnedCourses() {
  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <section className="grid grid-cols-1">
        <OwnedCourseCard />
      </section>
    </>
  );
}

OwnedCourses.Layout = BaseLayout;
