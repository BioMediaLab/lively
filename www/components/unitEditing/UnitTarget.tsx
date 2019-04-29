import React from "react";
import { Droppable } from "react-beautiful-dnd";
import FileItem, { File } from "./FileItem";
import styled from "styled-components";

interface Props {
  id: string;
  files: File[];
}

const ItemHolder = styled.div<{ dropping: boolean }>`
  padding-top: 1rem;
  min-height: 70vh;
  background-color: ${props => (props.dropping ? "grey" : "white")};
`;

const UnitTarget: React.FC<Props> = props => {
  return (
    <div>
      <Droppable droppableId={props.id} type="FILEITEM">
        {(dropProvided, dropSnap) => (
          <ItemHolder
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            dropping={dropSnap.isDraggingOver}
          >
            {props.files.map((file, index) => (
              <FileItem key={file.id} file={file} index={index} />
            ))}
            {dropProvided.placeholder}
          </ItemHolder>
        )}
      </Droppable>
    </div>
  );
};

export default UnitTarget;