import React from "react";
import styled from "styled-components";

const DialogBacking = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: #00000060;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  align-content: space-around;
  justify-content: space-around;
`;

const DialogFront = styled.div`
  background-color: white;
  border-radius: 2rem;
  margin-top: 7rem;
  padding: 2rem;
  min-width: 80vw;
`;

interface Props {
  showing: boolean;
  title?: string;
}

const BigDialog: React.FC<Props> = props => {
  if (!props.showing) {
    return <React.Fragment />;
  }
  return (
    <DialogBacking>
      <DialogFront>
        {props.title ? <h1>{props.title}</h1> : <span />}
        {props.children}
      </DialogFront>
    </DialogBacking>
  );
};

export default BigDialog;
