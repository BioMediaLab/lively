import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { setRedirCookie } from "../lib/session";

const Login = () => (
  <div>
    <Query
      query={gql`
        query GET_GOOGLE_REDIRECT {
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

export default Login;
