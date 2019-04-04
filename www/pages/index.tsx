import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  text-rendering: optimizeLegibility;
  padding: 0 20px;
  display: block;
`;

export default () => (
  <div>
    <Title>
      <img height="50" src="/static/lively@2x.png" alt="lively" />
    </Title>
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
