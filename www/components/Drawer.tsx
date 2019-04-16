import React from "react";
import { useState, FunctionComponent } from "react";
import styled from "styled-components";

const Behind = styled.div<{ open: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  display: ${props => (props.open ? "block" : "none")};
  width: 100vw;
  height: 100vh;
  background-color: #00000060;
`;

const MainDrawer = styled.div<{ open: boolean }>`
  width: 20rem;
  height: 100vh;
  display: ${props => (props.open ? "block" : "none")};
  position: fixed;
  background-color: pink;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 0.5rem 0rem 0.5rem green;
`;

const Drawer: FunctionComponent = props => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>BURGER</button>
      <Behind open={open} onClick={() => setOpen(false)}>
        <MainDrawer open={open}>{props.children}</MainDrawer>
      </Behind>
    </>
  );
};

export default Drawer;
