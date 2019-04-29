import React, { useCallback } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useApolloClient } from "react-apollo-hooks";

import { initial, reducer, Unit, Action } from "./stateManager";
import { onChange as updateApollo } from "./apolloManager";
import { useUndoRedo, useUndoRedoKeys } from "../../lib/undoRedoHook";
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
  const { state, dispatch, undo, redo, pastStates, redoStates } = useUndoRedo(
    reducer,
    initial(props.initialUnits)
  );
  useUndoRedoKeys(undo, redo);
  const apolloCli = useApolloClient();
  const dispatchWithDB = useCallback(
    (action: Action) => {
      dispatch(action);
      updateApollo(action, state, apolloCli, dispatch);
    },
    [state]
  );

  const onDragEnd = useCallback(
    (res: DropResult, prov) => {
      if (!res.destination) {
        return;
      }
      if (res.type === "FILEITEM") {
        dispatchWithDB({
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
        dispatchWithDB({
          type: "swapunit",
          args: {
            srcUnitIndex: res.source.index,
            destUnitIndex: res.destination.index
          }
        });
      }
      console.log("drag ended", res, prov);
    },
    [state]
  );

  console.log("render", state);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <button
        disabled={!(pastStates > 0)}
        onClick={() => {
          undo();
        }}
      >
        Undo
      </button>
      <button
        disabled={!(redoStates > 0)}
        onClick={() => {
          redo();
        }}
      >
        Redo
      </button>
      <StatusDisplay status={state.curAction} />
      <Droppable droppableId={"units"} type="UNIT" direction="horizontal">
        {(provided, snap) => (
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
