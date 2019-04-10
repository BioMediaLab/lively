import React from "react";
import { useState, FunctionComponent } from "react";
import { Button } from "rebass";
import styled from "styled-components";

const MainDrawer = styled.div<{ open: boolean }>`
  width: 20rem;
  height: 100vh;
  display: ${props => (props.open ? "default" : "none")};
`;

const Drawer: FunctionComponent = props => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>O</Button>
      <MainDrawer open={open}>{props.children}</MainDrawer>
    </>
  );
};

export default Drawer;
