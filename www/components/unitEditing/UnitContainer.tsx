import React, { useCallback, useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

import ControlsButton from "../ui/ControlsButton";
import EditableTextItem from "../ui/EditableTextItem";
import { UnitEditDispatch } from "./stateManager";
import AreYouSure from "../ui/AreYouSure";

interface Props {
  id: string;
  index: number;
  name: string;
}

const Body = styled.div<{ isDragging: boolean }>`
  min-width: 25rem;
  max-width: 40rem;
  height: 100%;
  margin: 0 1rem;
  border: 1px solid ${props => (props.isDragging ? "red" : "orange")};
  border-radius: 1rem;
  padding: 1rem;
  background-color: white;
`;

const Top = styled.div<{ isDragging: boolean }>`
  min-height: 2rem;
  background-color: ${props => (props.isDragging ? "red" : "white")};
  border-bottom: 1px solid black;
`;

const Controls = styled.div`
  display: flex;
  padding: 1rem;
`;

const UnitContainer: React.FC<Props> = props => {
  const dispatch = useContext(UnitEditDispatch);
  const updateUnitsName = useCallback(
    (newName: string) => {
      if (dispatch) {
        dispatch({
          type: "unitname",
          args: {
            newName,
            unitId: props.id
          }
        });
      }
    },
    [dispatch, props.id]
  );
  const [showingDeleteConf, setShowDel] = useState(false);
  const handleDel = useCallback(
    confirmed => {
      setShowDel(false);
      if (confirmed && dispatch) {
        dispatch({
          type: "unitdelete",
          args: {
            unitId: props.id
          }
        });
      }
    },
    [dispatch, props.id]
  );

  return (
    <>
      <AreYouSure showing={showingDeleteConf} onSelect={handleDel} />
      <Draggable draggableId={`${props.id}-unit`} index={props.index}>
        {(prov, snap) => (
          <Body
            ref={prov.innerRef}
            {...prov.draggableProps}
            isDragging={snap.isDragging}
          >
            <Top isDragging={snap.isDragging} {...prov.dragHandleProps}>
              <EditableTextItem
                bodyText={props.name}
                onUpdate={updateUnitsName}
              />
              <Controls>
                <ControlsButton>Add File</ControlsButton>
                <ControlsButton onClick={() => setShowDel(true)}>
                  Delete
                </ControlsButton>
              </Controls>
            </Top>
            {props.children}
          </Body>
        )}
      </Draggable>
    </>
  );
};

export default UnitContainer;
