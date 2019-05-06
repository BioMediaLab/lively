import React from "react";
import { CurAction } from "./stateManager";

interface Props {
  status: CurAction;
}

const StatusDisplay: React.FC<Props> = props => {
  let msg = "All Changes Saved.";
  switch (props.status) {
    case CurAction.Fail:
      msg = "An Error Ocurred.";
      break;
    case CurAction.None:
      msg = "Waiting for changes...";
      break;
    case CurAction.Saving:
      msg = "Saving Changes...";
      break;
    case CurAction.Creating:
      msg = "Creating...";
      break;
  }
  return <div>{msg}</div>;
};

export default StatusDisplay;
