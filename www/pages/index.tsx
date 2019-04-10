import styled from "styled-components";
import Link from "next/link";
import makePage from "../lib/makePage";
import { NextFunctionComponent } from "next";

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  text-rendering: optimizeLegibility;
  padding: 0 20px;
  display: block;
`;

const Index: NextFunctionComponent = () => (
  <div>
    <Title>
      <img height="50" src="/static/lively@2x.png" alt="lively" />
    </Title>
    <Link href="/settings">
      <a>Settings</a>
    </Link>
  </div>
);

export default makePage(Index);
