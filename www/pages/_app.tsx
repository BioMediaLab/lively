import { Container, DefaultAppIProps, AppComponentProps } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { ThemeProvider } from "styled-components";

import withApolloClient from "../lib/with-apollo-client";
import { getTheme, ThemeType } from "../lib/theme";

class MyApp extends React.Component<
  {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    hasSession: boolean;
  } & DefaultAppIProps &
    AppComponentProps
> {
  static displayName = "_APP";
  /*
    getIntialProps is not currently configured on this component and will not run.
    See with-apollo-client
  */
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    const theme = getTheme(ThemeType.Light);
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <ApolloHooksProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </ApolloHooksProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
