/*
Apollo Update Manager Singleton
*/
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";

import { State, CurAction, Action, File, Unit } from "./stateManager";
import { UpdateUnit, UpdateUnitVariables } from "./__generated__/UpdateUnit";
import { UpdateFile, UpdateFileVariables } from "./__generated__/UpdateFile";
import { OnComplete } from "../../lib/undoRedoHook";

// types

interface PendingUnitUpdate {
  id: string;
  order?: number;
  name?: string;
  description?: string;
}

interface PendingFileUpdate {
  id: string;
  file_name?: string;
  order?: number;
  unit_id?: string;
  description?: string;
}

interface PendingFileDelete {
  id: string;
}

interface PendingUnitDelete {
  id: string;
}

interface Change {
  file_update?: PendingFileUpdate;
  unit_update?: PendingUnitUpdate;
  file_delete?: PendingFileDelete;
  unit_delete?: PendingUnitDelete;
  file_create?: boolean;
  unit_create?: boolean;
}

interface WhatChanges {
  file_create: boolean;
  file_delete: boolean;
  file_update: boolean;
  unit_create: boolean;
  unit_delete: boolean;
  unit_update: boolean;
}

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
type OrderedFile = File & { order: number; unit_id: string };
type OrderedUnit = Without<Unit, "files"> & { order: number };

// MUTATIONS
const UpdateUnitAST = gql`
  mutation UpdateUnit($unit: ID!, $order: Int, $name: String) {
    updateClassUnit(unit_id: $unit, order: $order, name: $name) {
      id
      order
      name
    }
  }
`;

const UpdateFileAST = gql`
  mutation UpdateFile($file: ID!, $unit: ID, $order: Int, $name: String) {
    updateClassFile(
      file_id: $file
      unit_id: $unit
      order: $order
      name: $name
    ) {
      id
      order
      file_name
    }
  }
`;

const DeleteClassUnitAST = gql`
  mutation DeleteClassUnit($unit: ID!) {
    rmClassUnit(unit_id: $unit)
  }
`;

const mutateUnit = async (update: PendingUnitUpdate) => {
  if (!cli) {
    throw new Error("must run setup function");
  }
  return cli.mutate<UpdateUnit, UpdateUnitVariables>({
    mutation: UpdateUnitAST,
    variables: { unit: update.id, order: update.order, name: update.name }
  });
};

const mutateFile = async (update: PendingFileUpdate) => {
  if (!cli) {
    throw new Error("must run setup function");
  }
  return cli.mutate<UpdateFile, UpdateFileVariables>({
    mutation: UpdateFileAST,
    variables: {
      file: update.id,
      unit: update.unit_id,
      order: update.order,
      name: update.file_name
    }
  });
};

const deleteUnit = async (update: PendingUnitDelete) => {
  if (!cli) {
    throw new Error("mut run setup function");
  }
  return cli.mutate({
    mutation: DeleteClassUnitAST,
    variables: { unit: update.id }
  });
};

const statesDeepCompare = (oldState: State, newState: State): Change[] => {
  const oldFiles: Map<string, OrderedFile> = oldState.units.reduce(
    (acc, { files, id }) => {
      files
        .map((file, index) => ({ order: index, unit_id: id, ...file }))
        .forEach(file => {
          acc.set(file.id, file);
        });
      return acc;
    },
    new Map()
  );

  const oldUnits: Map<string, OrderedUnit> = oldState.units
    .map((unit, index) => ({
      order: index,
      ...unit
    }))
    .reduce((acc, unit) => {
      acc.set(unit.id, unit);
      return acc;
    }, new Map());

  const changes = newState.units.reduce<Change[]>((acc, unit, unitIndex) => {
    if (oldUnits.has(unit.id)) {
      const oldUnit = oldUnits.get(unit.id);
      if (oldUnit && oldUnit.name !== unit.name) {
        acc.push({
          unit_update: {
            id: unit.id,
            name: unit.name
          }
        });
      }
      if (oldUnit && oldUnit.order !== unitIndex) {
        acc.push({
          unit_update: {
            id: unit.id,
            order: unitIndex
          }
        });
      }
      oldUnits.delete(unit.id);
    } else {
      // A new unit has been added
      acc.push({ unit_create: true });
    }
    acc.push(
      ...unit.files.reduce<Change[]>((acc, file, fileIndex) => {
        const oldFile = oldFiles.get(file.id);
        if (oldFile) {
          const delta: any = {};
          if (oldFile.file_name !== file.file_name) {
            delta.file_name = file.file_name;
          }
          if (oldFile.order !== fileIndex) {
            delta.order = fileIndex;
          }
          if (oldFile.unit_id !== unit.id) {
            delta.unit_id = unit.id;
          }
          if (Object.keys(delta).length > 0) {
            delta.id = file.id;
            acc.push({ file_update: delta });
          }
          oldFiles.delete(file.id);
        } else {
          // a new file has been added
          acc.push({ file_create: true });
        }
        return acc;
      }, [])
    );

    return acc;
  }, []);

  // handle potential deletions
  changes.push(
    ...Array.from(oldFiles.values()).map(file => ({
      file_delete: { id: file.id }
    }))
  );
  changes.push(
    ...Array.from(oldUnits.values()).map(({ id }) => ({
      unit_delete: { id }
    }))
  );

  return changes;
};

export const stateChangeSummary = (oldState: State, newState: State) => {
  const delta = statesDeepCompare(oldState, newState);
  const what: WhatChanges = {
    file_create: false,
    file_delete: false,
    file_update: false,
    unit_create: false,
    unit_delete: false,
    unit_update: false
  };
  return delta.reduce<WhatChanges>((acc, ch) => {
    if ("file_create" in ch) {
      acc.file_create = true;
    }
    if ("unit_create" in ch) {
      acc.unit_create = true;
    }
    return acc;
  }, what);
};

// state
// set via the setup function
let cli: ApolloClient<any>;
let updateCurAction: ((action: CurAction) => void) | null = null;

// storing the state of the editor
let timeout: number | null = null;
const changes: {
  old: State | null;
  new: State | null;
} = { old: null, new: null };

// functions

const reduce = async () => {
  try {
    if (changes.old && changes.new) {
      const updates = statesDeepCompare(changes.old, changes.new);

      for (const upd of updates) {
        if (upd.file_update) {
          await mutateFile(upd.file_update);
        }
        if (upd.unit_update) {
          await mutateUnit(upd.unit_update);
        }
        if (upd.unit_delete) {
          await deleteUnit(upd.unit_delete);
        }
      }
      changes.old = changes.new;

      if (updateCurAction) {
        updateCurAction(CurAction.Saved);
      }
    }
  } catch (err) {
    console.warn(err);
    if (updateCurAction) {
      updateCurAction(CurAction.Fail);
    }
  }
};

export const setup = (
  iState: State,
  c: ApolloClient<any>,
  u: (action: CurAction) => void
) => {
  changes.old = iState;
  changes.new = iState;
  cli = c;
  updateCurAction = u;
};

export const onDismount = () => {
  clearTimeout(timeout as any);
  updateCurAction = null;
  reduce();
};

export const onStateChange: OnComplete<State, Action> = (
  _type,
  _patches,
  _oldState,
  newState
) => {
  changes.new = newState;
  if (updateCurAction) {
    updateCurAction(CurAction.Saving);
  }

  // it's fine to clear a null timeout
  clearTimeout(timeout as any);
  setTimeout(reduce, 1000);
};
