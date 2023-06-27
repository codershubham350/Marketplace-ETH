import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const ActiveLink = ({ children, activeLinkClass, ...props }) => {
  const { pathname } = useRouter();
  let className = children.props.className || "";

  if (pathname === props.href) {
    className = `${className} ${
      activeLinkClass ? activeLinkClass : "text-indigo-600"
    }`;
  }
  return (
    <>
      <Link {...props} legacyBehavior>
        {/*Can provide additional props*/}
        {React.cloneElement(children, { className })}
      </Link>
    </>
  );
};

export default ActiveLink;
