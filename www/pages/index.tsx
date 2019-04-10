import Link from "next/link";
import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import ClassList from "../components/ClassList";

const Index: NextFunctionComponent = () => (
  <div>
    <ClassList />
    <Link href="/settings">
      <a>Settings</a>
    </Link>
  </div>
);

export default makePage(Index);
