/*
Apollo Update Manager Singleton
*/
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";

import { State, CurAction, getUnitIndex, Action } from "./stateManager";
import { UpdateUnit, UpdateUnitVariables } from "./__generated__/UpdateUnit";
import { UpdateFile, UpdateFileVariables } from "./__generated__/UpdateFile";
import { Patch } from "immer";
import { OnComplete } from "../../lib/undoRedoHook";

// MUTATIONS
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

// types

interface Changes {
  patches: Patch[];
  oldState: State;
  action?: Action;
}

interface PendingUnitUpdate {
  id: string;
  order?: number;
  name?: string;
}

interface PendingFileUpdate {
  id: string;
  file_name?: string;
  order?: number;
  unit_id?: string;
}

// state
// set via the setup function
let cli: ApolloClient<any>;
let updateCurAction: ((action: CurAction) => void) | null = null;

// storing the state of the editor
let timeout: number | null = null;
const changes: Changes[] = [];
const antiChanges: Changes[] = [];

// functions
const mutateUnits = async (updates: Iterable<PendingUnitUpdate>) => {
  if (!cli) {
    throw new Error("must run setup function");
  }
  for (const update of updates) {
    await cli.mutate<UpdateUnit, UpdateUnitVariables>({
      mutation: UpdateUnitAST,
      variables: { unit: update.id, order: update.order }
    });
  }
};

const mutateFiles = async (updates: Iterable<PendingFileUpdate>) => {
  if (!cli) {
    throw new Error("must run setup function");
  }
  for (const update of updates) {
    await cli.mutate<UpdateFile, UpdateFileVariables>({
      mutation: UpdateFileAST,
      variables: { file: update.id, unit: update.unit_id, order: update.order }
    });
  }
};

const reduce = async () => {
  const pendingUnits = new Map<string, PendingUnitUpdate>();
  const pendingFiles = new Map<string, PendingFileUpdate>();

  console.log("APOLLO REDUCE", changes);

  changes.forEach(({ patches, oldState }) => {
    console.log(patches, oldState);
    if (patches.length === 0) {
      return;
    }
    const topPatch = patches[0];
    // An existing unit has been changed
    if (topPatch.op === "replace" && topPatch.value.__typename == "ClassUnit") {
      const updatedUnit: PendingUnitUpdate = { id: topPatch.value.id };
      const oldUnit =
        oldState.units[getUnitIndex(oldState.units, updatedUnit.id)];
      if (oldUnit.name !== topPatch.value.name) {
        updatedUnit.name = topPatch.value.name;
      }
      if (topPatch.path[1] !== getUnitIndex(oldState.units, updatedUnit.id)) {
        updatedUnit.order = topPatch.path[1] as any;
      }
      if ("order" in updatedUnit || "name" in updatedUnit) {
        pendingUnits.set(updatedUnit.id, updatedUnit);
      }
    }

    patches.forEach(patch => {
      if (patch.value && patch.value.__typename == "ClassFile") {
        const upFile: PendingFileUpdate = { id: patch.value.id };
        if (patch.op === "add") {
          const unit = oldState.units[patch.path[1] as any];
          upFile.unit_id = unit.id;
        }
        upFile.order = patch.path[3] as any;
        pendingFiles.set(upFile.id, upFile);
      }
    });
  });

  // clear out the changes
  changes.splice(0, changes.length);
  try {
    await mutateUnits(pendingUnits.values());
    await mutateFiles(pendingFiles.values());
    if (updateCurAction) {
      updateCurAction(CurAction.Saved);
    }
  } catch (err) {
    if (updateCurAction) {
      updateCurAction(CurAction.Fail);
    }
  }
  timeout = null;
};

export const setup = (c: ApolloClient<any>, u: (action: CurAction) => void) => {
  cli = c;
  updateCurAction = u;
};

export const onDismount = () => {
  reduce();
  clearTimeout(timeout as any);
};

export const onStateChange: OnComplete<State, Action> = (
  type,
  patches,
  oldState,
  _,
  action
) => {
  if (type == "undo" && changes.length > 0) {
    antiChanges.push(changes.pop() as any);
  } else if (type == "redo" && antiChanges.length > 0) {
    changes.push(antiChanges.pop() as any);
  } else {
    console.log("adding changes", patches);
    changes.push({ patches, oldState, action });
    antiChanges.splice(0, antiChanges.length);
  }
  if (updateCurAction) {
    updateCurAction(CurAction.Saving);
  }

  if (typeof timeout !== "number") {
    timeout = setTimeout(reduce, 2000);
  }
};
