import React from "react";
import { Box } from "rebass";

const Fieldset = props => (
  <Box {...props} as="fieldset" css={{ border: "none" }} />
);

export default Fieldset;
