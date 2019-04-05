import React from "react";
import initApollo from "./init-apollo";
import Head from "next/head";
import { getMarkupFromTree } from "react-apollo-hooks";
import {
  AppComponentType,
  AppComponentContext,
  AppComponentProps,
  DefaultAppIProps
} from "next/app";
import { NormalizedCacheObject, ApolloClient } from "apollo-boost";
import { renderToString } from "react-dom/server";
import { getSessionCookie } from "./session";

export default (
  App: AppComponentType<
    {
      apolloClient: ApolloClient<NormalizedCacheObject>;
      hasSession: boolean;
    } & DefaultAppIProps
  >
) => {
  return class Apollo extends React.Component<
    AppComponentProps & {
      apolloState: NormalizedCacheObject;
      hasSession: boolean;
    } & DefaultAppIProps
  > {
    static displayName = "withApollo(App)";
    static async getInitialProps(ctx: AppComponentContext) {
      const { Component, router } = ctx;
      const hasSession = getSessionCookie(ctx.ctx) ? true : false;

      let pageProps = {};
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx.ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo(null);
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: (
              <App
                Component={Component}
                router={router}
                apolloClient={apollo}
                pageProps={pageProps}
                hasSession={hasSession}
              />
            )
          });
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getMarkupFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        pageProps,
        apolloState,
        hasSession
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(
      props: AppComponentProps &
        DefaultAppIProps & {
          apolloState: NormalizedCacheObject;
          hasSession: boolean;
        }
    ) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return (
        <App
          {...this.props}
          apolloClient={this.apolloClient}
          pageProps={this.props.pageProps}
        />
      );
    }
  };
};
