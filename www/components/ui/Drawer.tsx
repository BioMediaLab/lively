import React from "react";
import { useState, FunctionComponent } from "react";
import styled from "styled-components";
import { MdList } from "react-icons/md";

import IconButton from "./IconButton";
import BorderlessIconButton from "./BorderlessIconButton";

const Behind = styled.div<{ open: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  display: ${props => (props.open ? "block" : "none")};
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.background.overlay};
`;

const MainDrawer = styled.div<{ open: boolean }>`
  width: 20rem;
  height: 100vh;
  display: ${props => (props.open ? "block" : "none")};
  position: fixed;
  background-color: ${props => props.theme.colors.main.secondary};
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 0.5rem 0rem 0.5rem ${props => props.theme.colors.main.secondary};
`;

const Drawer: FunctionComponent = props => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BorderlessIconButton onClick={() => setOpen(!open)}>
        <MdList size={30} />
      </BorderlessIconButton>
      <Behind open={open} onClick={() => setOpen(false)}>
        <MainDrawer open={open}>{props.children}</MainDrawer>
      </Behind>
    </>
  );
};

export default Drawer;
