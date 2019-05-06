import React, { useCallback, useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Box } from "rebass";

import { classUnits } from "../../routes";
import ControlsButton from "../ui/ControlsButton";
import EditableTextItem from "../ui/EditableTextItem";
import { UnitEditDispatch } from "./stateManager";
import AreYouSure from "../ui/AreYouSure";
import BigDialog from "../ui/BigDialog";
import ClassContentUpload from "../ClassContentUpload";

interface Props {
  id: string;
  classId: string;
  index: number;
  name: string;
}

const Body = styled.div<{ isDragging: boolean }>`
  min-width: 25rem;
  max-width: 40rem;
  height: 100%;
  margin: 0 1rem;
  border: 1px solid
    ${props =>
      props.isDragging
        ? props.theme.colors.main.accent
        : props.theme.colors.main.altAccent};
  border-radius: 1rem;
  padding: 1rem;
  background-color: ${p => p.theme.colors.background.primary};
`;

const Top = styled.div<{ isDragging: boolean }>`
  min-height: 2rem;
  background-color: ${props =>
    props.isDragging
      ? props.theme.colors.background.secondary
      : props.theme.colors.background.primary};
  border-bottom: 1px solid ${p => p.theme.colors.main.secondary};
`;

const Controls = styled.div`
  display: flex;
  padding-bottom: 1rem;
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
  const [showingFileAdd, setShowAdd] = useState(false);

  return (
    <>
      <BigDialog showing={showingFileAdd}>
        <ClassContentUpload
          class_id={props.classId}
          unit_id={props.id}
          onCancel={() => {
            setShowAdd(false);
          }}
          onSubmit={() => setShowAdd(false)}
        />
      </BigDialog>
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
                <Box px={3}>
                  <ControlsButton onClick={() => setShowAdd(true)}>
                    Add File
                  </ControlsButton>
                </Box>
                <Box px={3}>
                  <ControlsButton onClick={() => setShowDel(true)}>
                    Delete
                  </ControlsButton>
                </Box>
                <Box px={3}>
                  <ControlsButton
                    onClick={() =>
                      classUnits.push(
                        `/classes/${props.classId}/units/${props.id}`
                      )
                    }
                  >
                    View
                  </ControlsButton>
                </Box>
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
