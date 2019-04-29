import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface Props {
  id: string;
  index: number;
  name: string;
}

const Body = styled.div<{ isDragging: boolean }>`
  width: 25rem;
  height: 100%;
  margin: 0 1rem;
  border: 1px solid ${props => (props.isDragging ? "red" : "orange")};
  border-radius: 1rem;
  padding: 1rem;
  background-color: white;
`;

const Title = styled.div<{ isDragging: boolean }>`
  min-height: 2rem;
  background-color: ${props => (props.isDragging ? "red" : "white")};
`;

const UnitContainer: React.FC<Props> = props => {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(prov, snap) => (
        <Body
          ref={prov.innerRef}
          {...prov.draggableProps}
          isDragging={snap.isDragging}
        >
          <Title isDragging={snap.isDragging} {...prov.dragHandleProps}>
            {props.name}
          </Title>
          {props.children}
        </Body>
      )}
    </Draggable>
  );
};

export default UnitContainer;
