import { useReducer, useCallback, useEffect, Reducer } from "react";
import produce, { applyPatches, Patch } from "immer";

interface InternalState {
  cur: any;
  past: Array<{ undo: Patch[]; redo: Patch[] }>;
  future: Array<{ undo: Patch[]; redo: Patch[] }>;
}

enum InternalActionType {
  UNDO,
  REDO,
  DISPATCH
}

export interface OnComplete<State, Action> {
  (
    type: "undo" | "redo" | "dispatch",
    patches: Patch[],
    oldState: State,
    newState: State,
    act?: Action
  ): void;
}

interface InternalAction {
  type: InternalActionType;
  dispAction?: any;
}

interface ReturnType<State, Action> {
  state: State;
  dispatch: (action: Action) => void;
  undoEnabled: boolean;
  redoEnabled: boolean;
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State,
  globalOnComplete?: OnComplete<State, Action>
): ReturnType<State, Action> {
  const internalReducer = useCallback(
    (oldState: InternalState, args: InternalAction) => {
      if (args.type === InternalActionType.UNDO) {
        const recent = oldState.past.pop();
        if (recent) {
          const cur = applyPatches(oldState.cur, recent.undo);
          oldState.future.push(recent);
          if (globalOnComplete) {
            globalOnComplete("undo", recent.undo, oldState.cur, cur);
          }
          return {
            future: oldState.future,
            past: oldState.past,
            cur
          };
        }
        return oldState;
      }
      if (args.type === InternalActionType.REDO) {
        const recent = oldState.future.pop();
        if (recent) {
          const cur = applyPatches(oldState.cur, recent.redo);
          oldState.past.push(recent);
          if (globalOnComplete) {
            globalOnComplete("redo", recent.redo, oldState.cur, cur);
          }
          return {
            future: oldState.future,
            past: oldState.past,
            cur
          };
        }
        return oldState;
      }

      if (!("dispAction" in args)) {
        return oldState;
      }

      const undo: Patch[] = [];
      const redo: Patch[] = [];
      const cur = produce(
        oldState.cur,
        draftState => reducer(draftState, args.dispAction),
        (patches, undoPatches) => {
          undo.push(...undoPatches);
          redo.push(...patches);
        }
      );

      if (globalOnComplete) {
        globalOnComplete(
          "dispatch",
          redo,
          oldState.cur,
          cur as any,
          args.dispAction
        );
      }

      return {
        cur,
        future: [],
        past: [...oldState.past, { undo, redo }]
      };
    },
    []
  );

  // internal initial state
  const internalState = {
    cur: initialState,
    past: [],
    future: []
  };

  // internal reducer functions
  const [state, dispatch] = useReducer(internalReducer, internalState);

  // external function for use by hook consumer
  const extDispatch = useCallback((action: Action) => {
    dispatch({
      type: InternalActionType.DISPATCH,
      dispAction: action
    });
  }, []);

  return {
    state: state.cur,
    dispatch: extDispatch,
    undoEnabled: state.past.length > 0,
    redoEnabled: state.future.length > 0,
    undo: () => dispatch({ type: InternalActionType.UNDO }),
    redo: () => dispatch({ type: InternalActionType.REDO })
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
