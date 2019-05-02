import React, { useCallback, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

import EditableTextItem from "../ui/EditableTextItem";
import { UnitEditDispatch } from "./stateManager";

const FileItemBody = styled.div<{ dragging: boolean }>`
  min-height: 3rem;
  border: 0.2rem solid lightgoldenrodyellow;
  border-radius: 1rem;
  margin: 1rem 0;
  padding-left: 1rem;
  background-color: ${props => (props.dragging ? "lightgrey" : "white")};
`;

export interface File {
  id: string;
  file_name: string;
}
interface Props {
  file: File;
  index: number;
  unit: string;
}

const FileItem: React.FC<Props> = props => {
  const dispatch = useContext(UnitEditDispatch);
  const updateMyName = useCallback(
    (newName: string) => {
      if (dispatch) {
        dispatch({
          type: "filename",
          args: {
            newName,
            unit: props.unit,
            index: props.index
          }
        });
      }
    },
    [props.unit, props.index]
  );

  return (
    <Draggable draggableId={`file-item-${props.file.id}`} index={props.index}>
      {(provided, snapshot) => (
        <FileItemBody
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          dragging={snapshot.isDragging}
        >
          <EditableTextItem
            bodyText={props.file.file_name}
            onUpdate={updateMyName}
          />
        </FileItemBody>
      )}
    </Draggable>
  );
};
export default FileItem;
