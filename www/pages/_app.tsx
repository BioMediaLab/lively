import { Container, DefaultAppIProps, AppComponentProps } from "next/app";
import React from "react";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";

class MyApp extends React.Component<
  { apolloClient: ApolloClient<NormalizedCacheObject> } & DefaultAppIProps &
    AppComponentProps
> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
