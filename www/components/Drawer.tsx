import React from "react";
import { useState, FunctionComponent } from "react";
import { Button } from "rebass";
import styled from "styled-components";

const MainDrawer = styled.div<{ open: boolean }>`
  width: 20rem;
  height: 100vh;
  display: ${props => (props.open ? "default" : "none")};
  position: fixed;
  background-color: pink;
  left: 0;
  height: 100vh;
`;

const Drawer: FunctionComponent = props => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>O</Button>
      <MainDrawer open={open}>
        <div>
          <Button onClick={() => setOpen(false)}>Close</Button>
          {props.children}
        </div>
      </MainDrawer>
    </>
  );
};

export default Drawer;
