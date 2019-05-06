import React from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { Image } from "rebass";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import "normalize.css";

import { deleteSessionFrontend } from "../lib/session";
import Login from "./Login";
import Drawer from "./ui/Drawer";
import ClassList from "./ClassList";
import ControlsButton from "./ui/ControlsButton";

const HeaderStyles = styled.header`
  display: flex;
  justify-content: space-around;
  height: 3rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.main.primary};
  box-shadow: 0 0.25rem 0.25rem ${props => props.theme.colors.main.secondary};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  z-index: 10;
`;

const Logo = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-70%, -40%);
  left: 50%;
  z-index: 11;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-evenly;
`;

const Main = styled.main`
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${p => p.theme.text.family};
`;

interface Props {
  hasSession: boolean;
}

const Layout: React.FunctionComponent<Props> = props => {
  const logout = useMutation(gql`
    mutation LogOutMute {
      logout {
        id
      }
    }
  `);

  let child;
  if (props.hasSession) {
    child = (
      <div>
        <HeaderStyles>
          <ButtonsContainer>
            <Drawer>
              <ClassList />
            </Drawer>
          </ButtonsContainer>
          <Logo>
            <Link href="/">
              <img height="48" src="/static/lively@2x.png" alt="lively" />
            </Link>
          </Logo>
          <ControlsButton
            onClick={() => {
              logout().finally(() => {
                deleteSessionFrontend();
                window.location.reload(true);
              });
            }}
          >
            Logout
          </ControlsButton>
          <Link href="/settings">
            <ControlsButton>Settings</ControlsButton>
          </Link>
        </HeaderStyles>
        <Main style={{ paddingTop: "5rem" }}>{props.children}</Main>
      </div>
    );
  } else {
    child = <Login />;
  }

  return (
    <>
      <Head>
        <title>Lively Classes</title>
      </Head>
      {child}
    </>
  );
};

export default Layout;
