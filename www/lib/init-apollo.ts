import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { createUploadLink } from "apollo-upload-client";

type ApolloClientMaybe = null | ApolloClient<NormalizedCacheObject>;
let apolloClient: ApolloClientMaybe = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState: NormalizedCacheObject | null, session?: string) {
  const headers: any = {};
  if (session) {
    headers.session = session;
  }
  const link = createUploadLink({
    uri: process.env.API_URL, // Server URL (must be absolute)
    credentials: "include", // MUST HAVE CORS ENABLED
    headers
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    cache: new InMemoryCache().restore(initialState || {}),
    link
  });
}

export default function initApollo(
  initialState: NormalizedCacheObject | null,
  session?: string
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, session);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, session);
  }

  return apolloClient;
}
