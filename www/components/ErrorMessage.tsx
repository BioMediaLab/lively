import React, { FunctionComponent } from "react";
import { Text } from "rebass";
import { ApolloError } from "apollo-boost";

interface Props {
  message?: string;
  apolloErr?: ApolloError | undefined;
}

const ErrorMessage: FunctionComponent<Props> = ({ message, apolloErr }) => {
  if (message) {
    return <Text color="red">{message}</Text>;
  }
  if (apolloErr) {
    return <Text color="red">{apolloErr.message}</Text>;
  }
  return <Text color="red">An Error Has Ocurred</Text>;
};

export default ErrorMessage;
