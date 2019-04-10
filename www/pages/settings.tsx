import React from "react";
import makePage from "../lib/makePage";
import Link from "next/link";

const Settings = () => {
  return (
    <div>
      Settings...
      <Link href="/">
        <a>Return</a>
      </Link>
    </div>
  );
};

export default makePage(Settings);
