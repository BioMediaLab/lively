import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useApolloClient } from "react-apollo-hooks";

import { classesRoute } from "../../routes";
import {
  initial,
  reducer,
  Unit,
  CurAction,
  UnitEditDispatch
} from "./stateManager";
import {
  onDismount as apolloDismount,
  setup as apolloSetup,
  onStateChange,
  stateChangeSummary
} from "./apolloManager";
import { useUndoRedo, useUndoRedoKeys } from "../../lib/undoRedoHook";
import ControlsButton from "../ui/ControlsButton";
import CreateAUnit from "../CreateAUnit";
import UnitTarget from "./UnitTarget";
import UnitContainer from "./UnitContainer";
import StatusDisplay from "./StatusDisplay";

interface Props {
  initialUnits: Unit[];
  classId: string;
}

const UnitsHolder = styled.div`
  display: flex;
  width: 100vw;
  padding-top: 5rem;
`;

const TopBar = styled.div`
  display: flex;
  background-color: lemonchiffon;
  width: 120%;
  margin-left: -2rem;
  padding: 5rem 0 1rem 3rem;
  margin-bottom: 1rem;
  margin-top: -4rem;
  position: fixed;
  align-items: center;
`;

const UnitDDContext: React.FC<Props> = props => {
  // tracks whether the state is saved to DB or not
  const [curAction, setCurAction] = useState<CurAction>(CurAction.None);
  // tracks the editting state
  const { state, dispatch, undo, redo, undoEnabled, redoEnabled } = useUndoRedo(
    reducer,
    initial(props.initialUnits),
    onStateChange
  );
  // enables ^Z, ^Y for undo, redo
  useUndoRedoKeys(undo, redo);
  // grabs a copy of ApolloCli to update DB with
  const apolloCli = useApolloClient();
  // when the component unmounts, fire any pending updates immediately
  // so that the user does not lose any work
  useEffect(() => {
    apolloSetup(state, apolloCli, setCurAction);
    return () => {
      apolloDismount();
    };
  }, []);
  // reset the state when the props change
  useEffect(() => {
    const chz = stateChangeSummary(state, initial(props.initialUnits));
    if (chz.unit_create || chz.file_create) {
      dispatch(
        { type: "reset", args: { newState: { units: props.initialUnits } } },
        false
      );
    }
  }, [state, props.initialUnits]);

  // handle all events from drag and drop
  const onDragEnd = useCallback(
    (res: DropResult) => {
      if (!res.destination) {
        return;
      }
      if (res.type === "FILEITEM") {
        if (
          res.source.droppableId === res.destination.droppableId &&
          res.source.index === res.destination.index
        ) {
          // nothing happened
          return;
        }
        dispatch({
          type: "swapfile",
          args: {
            sourceUnit: res.source.droppableId,
            destUnit: res.destination.droppableId,
            destIndex: res.destination.index,
            sourceIndex: res.source.index
          }
        });
      }
      if (res.type === "UNIT") {
        if (res.source.index === res.destination.index) {
          // nothing happened
          return;
        }
        dispatch({
          type: "swapunit",
          args: {
            srcUnitIndex: res.source.index,
            destUnitIndex: res.destination.index
          }
        });
      }
    },
    [state]
  );

  console.log("RENDER", state);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <TopBar>
        <ControlsButton
          onClick={() => {
            classesRoute.push(`/classes/${props.classId}`);
          }}
        >
          Save and Exit
        </ControlsButton>
        <CreateAUnit classId={props.classId} />
        <ControlsButton
          disabled={!undoEnabled}
          onClick={() => {
            undo();
          }}
        >
          Undo
        </ControlsButton>
        <ControlsButton
          disabled={!redoEnabled}
          onClick={() => {
            redo();
          }}
        >
          Redo
        </ControlsButton>
        <StatusDisplay status={curAction} />
      </TopBar>
      <UnitEditDispatch.Provider value={dispatch}>
        <Droppable droppableId={"units"} type="UNIT" direction="horizontal">
          {provided => (
            <UnitsHolder ref={provided.innerRef} {...provided.droppableProps}>
              {state.units.map((unit: Unit, ind: number) => (
                <UnitContainer
                  id={unit.id}
                  key={unit.id}
                  index={ind}
                  name={unit.name}
                >
                  <UnitTarget id={unit.id} files={unit.files} />
                </UnitContainer>
              ))}
              {provided.placeholder}
            </UnitsHolder>
          )}
        </Droppable>
      </UnitEditDispatch.Provider>
    </DragDropContext>
  );
};

export default UnitDDContext;
