import React from "react";
import { CurAction } from "./stateManager";

interface Props {
  status: CurAction;
}

const StatusDisplay: React.FC<Props> = props => {
  return <div>{props.status}</div>;
};

export default StatusDisplay;
