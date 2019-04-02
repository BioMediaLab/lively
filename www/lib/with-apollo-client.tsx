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

export default (
  App: AppComponentType<
    {
      apolloClient: ApolloClient<NormalizedCacheObject>;
    } & DefaultAppIProps
  >
) => {
  return class Apollo extends React.Component<
    AppComponentProps & {
      apolloState: NormalizedCacheObject;
    } & DefaultAppIProps
  > {
    static displayName = "withApollo(App)";
    static async getInitialProps(ctx: AppComponentContext) {
      const { Component, router } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
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
                {...appProps}
                Component={Component}
                router={router}
                apolloClient={apollo}
                pageProps={appProps}
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
        ...appProps,
        apolloState
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(
      props: AppComponentProps &
        DefaultAppIProps & { apolloState: NormalizedCacheObject }
    ) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
