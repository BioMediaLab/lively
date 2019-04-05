import styled from "styled-components";
import makePage from "../lib/makePage";

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  text-rendering: optimizeLegibility;
  padding: 0 20px;
  display: block;
`;

const Index = () => (
  <div>
    <Title>
      <img height="50" src="/static/lively@2x.png" alt="lively" />
    </Title>
  </div>
);

export default makePage(Index);
