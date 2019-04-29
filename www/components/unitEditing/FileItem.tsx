import React, { useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

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
}

const FileItem: React.FC<Props> = props => {
  return (
    <Draggable draggableId={`file-item-${props.file.id}`} index={props.index}>
      {(provided, snapshot) => (
        <FileItemBody
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          dragging={snapshot.isDragging}
        >
          <h4>{props.file.file_name}</h4>
        </FileItemBody>
      )}
    </Draggable>
  );
};
export default FileItem;
