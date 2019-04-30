export interface File {
  id: string;
  file_name: string;
}

export interface Unit {
  id: string;
  name: string;
  files: File[];
}

export enum CurAction {
  None,
  Saving,
  Saved,
  Undoing,
  Fail
}

export interface State {
  units: Unit[];
}

export interface Action {
  type: "swapfile" | "swapunit" | "action";
  args?: any;
}

export const getUnitIndex = (units: Unit[], unitId: string): number => {
  let index: null | number = null;
  units.forEach(({ id }, ind) => {
    if (id === unitId) {
      index = ind;
    }
  });
  if (typeof index !== "number") {
    throw new Error(`cannot find unit with id of ${unitId}`);
  }
  return index;
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "swapfile":
      const sourceUnitId = action.args.sourceUnit as string;
      const destUnitId = action.args.destUnit as string;
      const destIndex = action.args.destIndex as number;
      const sourceIndex = action.args.sourceIndex as number;

      const sourceUnit = state.units[getUnitIndex(state.units, sourceUnitId)];
      const destUnit = state.units[getUnitIndex(state.units, destUnitId)];
      const file = sourceUnit.files[sourceIndex];
      sourceUnit.files.splice(sourceIndex, 1);
      destUnit.files.splice(destIndex, 0, file);
      return state;

    case "swapunit":
      const { srcUnitIndex, destUnitIndex } = action.args;
      const curUnit = state.units[srcUnitIndex];
      const units = state.units;
      units.splice(srcUnitIndex, 1);
      units.splice(destUnitIndex, 0, curUnit);
      return state;

    default:
      throw new Error(`Action ${action} is unknown`);
  }
};

export const initial = (units: Unit[]): State => {
  return {
    units
  };
};
