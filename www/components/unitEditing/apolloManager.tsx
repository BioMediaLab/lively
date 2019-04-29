import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";

import { State, Action, CurAction, getUnitIndex } from "./stateManager";
import { UpdateUnit, UpdateUnitVariables } from "./__generated__/UpdateUnit";
import { UpdateFile, UpdateFileVariables } from "./__generated__/UpdateFile";

const UpdateUnitAST = gql`
  mutation UpdateUnit($unit: ID!, $order: Int) {
    updateClassUnit(unit_id: $unit, order: $order) {
      id
      order
      name
    }
  }
`;

const UpdateFileAST = gql`
  mutation UpdateFile($file: ID!, $unit: ID, $order: Int) {
    updateClassFile(file_id: $file, unit_id: $unit, order: $order) {
      id
      order
      file_name
    }
  }
`;

type Disp = (action: Action) => any;

interface Update {
  unit?: { id: string; order?: number; name?: string };
  file?: { id: string; unit_id?: string; order?: number; name?: string };
}

const actions: Update[] = [];

let timeout: number | null = null;

export const onChange = (
  action: Action,
  state: State,
  cli: ApolloClient<any>,
  dispatch: Disp
) => {
  console.log(action, state, cli);
  switch (action.type) {
    case "swapfile":
      const sourceUnitId = action.args.sourceUnit as string;
      const destUnitId = action.args.destUnit as string;
      const destIndex = action.args.destIndex as number;
      const sourceIndex = action.args.sourceIndex as number;

      const sourceUnit = state.units[getUnitIndex(state.units, sourceUnitId)];
      const destUnit = state.units[getUnitIndex(state.units, destUnitId)];
      const file = sourceUnit.files[sourceIndex];

      actions.push({
        file: {
          id: file.id,
          unit_id: destUnit.id,
          order: destIndex
        }
      });
      break;
    case "swapunit":
      const { srcUnitIndex, destUnitIndex } = action.args;
      const curUnit = state.units[srcUnitIndex];
      actions.push({
        unit: {
          id: curUnit.id,
          order: destUnitIndex
        }
      });
      break;
    default:
      return;
  }

  dispatch({ type: "action", args: { curAction: CurAction.Saving } });

  if (typeof timeout !== "number") {
    timeout = setTimeout(async () => {
      timeout = null;
      console.log("GO", actions);
      actions.forEach(act => {
        console.log(act);
        if (act.unit) {
          cli.mutate<UpdateUnit, UpdateUnitVariables>({
            mutation: UpdateUnitAST,
            variables: {
              unit: act.unit.id,
              order: act.unit.order
            }
          });
        }
        if (act.file) {
          cli.mutate<UpdateFile, UpdateFileVariables>({
            mutation: UpdateFileAST,
            variables: {
              file: act.file.id,
              order: act.file.order,
              unit: act.file.unit_id
            }
          });
        }
      });
      // clear out the actions array
      actions.splice(0, actions.length);
      dispatch({ type: "action", args: { curAction: CurAction.Saved } });
    }, 2000);
  }
};
