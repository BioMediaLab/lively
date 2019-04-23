import React from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { Image, Button } from "rebass";
import { deleteSessionFrontend } from "../lib/session";
import Login from "./Login";
import Drawer from "./Drawer";
import ClassList from "./ClassList";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

const HeaderStyles = styled.header`
  display: flex;
  height: 3rem;
  padding: 1rem;
  background-color: #fcff77;
  box-shadow: 0 0.25rem 0.25rem teal;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  z-index: 10;
`;

const Logo = styled.div`
  margin-left: 2rem;
  width: 15%;
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
          <Drawer>
            <ClassList />
          </Drawer>
          <Logo>
            <Link href="/">
              <Image
                width={[1, 1, 1 / 2]}
                src="/static/lively@2x.png"
                alt="lively"
              />
            </Link>
          </Logo>
          <Button
            onClick={() => {
              logout().finally(() => {
                deleteSessionFrontend();
                window.location.reload(true);
              });
            }}
          >
            Logout
          </Button>
          <Link href="/settings">
            <button>Settings</button>
          </Link>
        </HeaderStyles>
        <main style={{ paddingTop: "5rem" }}>{props.children}</main>
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
