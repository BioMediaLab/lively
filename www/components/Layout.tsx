import React from "react";
import styled from "styled-components";
import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { deleteSessionFrontend, setRedirCookie } from "../lib/session";

const HeaderStyles = styled.header`
  display: flex;
  color: blue;
  padding: 1rem;
  border-bottom: 0.1rem solid black;
  margin-left: -0.5rem;
  margin-right: -1rem;
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
          <div>Lively Classes</div>
          <button
            onClick={() => {
              deleteSessionFrontend();
              window.location.reload(true);
            }}
          >
            Logout
          </button>
        </HeaderStyles>
        <main>{props.children}</main>
      </div>
    );
  } else {
    child = (
      <div>
        <Query
          query={gql`
            query {
              googleRedirect
            }
          `}
        >
          {({ data, error, loading }) => {
            if (error || loading) {
              return <div>Loading...</div>;
            }
            const { googleRedirect } = data;
            return (
              <button
                onClick={() => {
                  // set the redirect cookie
                  setRedirCookie();
                  // and then send the user to Google
                  window.location.replace(googleRedirect);
                }}
              >
                Login
              </button>
            );
          }}
        </Query>
      </div>
    );
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
