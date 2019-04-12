import React from "react";
import { Box } from "rebass";

const Container = props => (
  <Box
    {...props}
    mx="auto"
    css={{
      maxWidth: "1024px"
    }}
  />
);

export default Container;
