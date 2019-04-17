import React, { FunctionComponent } from "react";
import { Text } from "rebass";
import { ApolloError } from "apollo-boost";

interface Props {
  message?: string;
  apolloErr?: ApolloError | undefined;
}

/** 
A component to handle the error messages that you deal with when using
apollo-react. You can pass it the ApolloError object and it will handle 
all the TS stuff.

Example:
```
const {error, loading, data} = useQuery(myQuery);

if (error) {
  return <ErrorMessage apolloErr={error} />
}
```
*/
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
