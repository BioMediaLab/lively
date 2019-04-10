import React from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { Image, Button } from "rebass";
import { deleteSessionFrontend } from "../lib/session";
import Login from "./Login";
import Drawer from "./Drawer";

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
`;

const Logo = styled.div`
  margin-left: 2rem;
  width: 15%;
`;

interface Props {
  hasSession: boolean;
}

const Layout: React.FunctionComponent<Props> = props => {
  let child;
  if (props.hasSession) {
    child = (
      <div>
        <HeaderStyles>
          <Drawer />
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
              deleteSessionFrontend();
              window.location.reload(true);
            }}
          >
            Logout
          </Button>
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
