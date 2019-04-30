import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useApolloClient } from "react-apollo-hooks";

import { initial, reducer, Unit, CurAction } from "./stateManager";
import {
  onDismount as apolloDismount,
  setup as apolloSetup,
  onStateChange
} from "./apolloManager";
import { useUndoRedo, useUndoRedoKeys } from "../../lib/undoRedoHook";
import ControlsButton from "../ui/ControlsButton";
import UnitTarget from "./UnitTarget";
import UnitContainer from "./UnitContainer";
import StatusDisplay from "./StatusDisplay";

interface Props {
  initialUnits: Unit[];
  name: string;
  id: string;
  files: File[];
}

const UnitsHolder = styled.div`
  display: flex;
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
    apolloSetup(apolloCli, setCurAction);
    return () => {
      apolloDismount();
    };
  }, []);
  // reset the state when the props change
  useEffect(() => {
    console.log("initialUnits", props.initialUnits);
    dispatch(
      { type: "reset", args: { newState: { units: props.initialUnits } } },
      false
    );
  }, [props.initialUnits]);

  const onDragEnd = useCallback(
    (res: DropResult) => {
      if (!res.destination) {
        return;
      }
      if (res.type === "FILEITEM") {
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
      <Droppable droppableId={"units"} type="UNIT" direction="horizontal">
        {provided => (
          <UnitsHolder ref={provided.innerRef} {...provided.droppableProps}>
            {state.units.map((unit, ind) => (
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
    </DragDropContext>
  );
};

export default UnitDDContext;
