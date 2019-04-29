import { useReducer, useCallback, useEffect, Reducer } from "react";
import produce, { applyPatches, Patch } from "immer";

interface IntS {
  cur: any;
  past: Array<{ undo: Patch[]; redo: Patch[] }>;
  future: Array<{ undo: Patch[]; redo: Patch[] }>;
}

interface ReturnType<State, Action> {
  state: State;
  dispatch: (action: Action) => void;
  pastStates: number;
  redoStates: number;
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: any
): ReturnType<State, Action> {
  const internalReducer = useCallback((oldState: IntS, args: any) => {
    if (args === "_undo") {
      const recent = oldState.past.pop();
      if (recent) {
        const cur = applyPatches(oldState.cur, recent.undo);
        oldState.future.push(recent);
        return {
          future: oldState.future,
          past: oldState.past,
          cur
        };
      }
      return oldState;
    }
    if (args === "_redo") {
      const recent = oldState.future.pop();
      if (recent) {
        const cur = applyPatches(oldState.cur, recent.redo);
        oldState.past.push(recent);
        return {
          future: oldState.future,
          past: oldState.past,
          cur
        };
      }
      return oldState;
    }

    const undo: Patch[] = [];
    const redo: Patch[] = [];
    const cur = produce(
      oldState.cur,
      draftState => reducer(draftState, args),
      (patches, undoPatches) => {
        undo.push(...undoPatches);
        redo.push(...patches);
      }
    );

    return {
      cur,
      future: [],
      past: [...oldState.past, { undo, redo }]
    };
  }, []);

  const internalState = {
    cur: initialState,
    past: [],
    future: []
  };

  const [state, dispatch] = useReducer(internalReducer, internalState);

  return {
    state: state.cur,
    dispatch,
    pastStates: state.past.length,
    redoStates: state.future.length,
    undo: () => dispatch("_undo"),
    redo: () => dispatch("_redo")
  };
}

export function useUndoRedoKeys(onUndo: Function, onRedo: Function) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const keyCode = event.keyCode;
      // key code 90 is "z"
      if (keyCode == 90 && event.ctrlKey) {
        onUndo();
      }
      // key code 89 is "y"
      if (keyCode == 89 && event.ctrlKey) {
        onRedo();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
}
