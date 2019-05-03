import React from "react";
import styled from "styled-components";

interface Props {
  onSelect: (yes: boolean) => any;
  showing: boolean;
  bodyText?: string;
  title?: string;
}

const Outline = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background-color: #00000060;
  display: flex;
  align-content: space-around;
  justify-content: space-around;
`;

const Front = styled.div`
  width: 30rem;
  height: min-content;
  background-color: white;
  color: #3a3a3a;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.1rem solid #049b00;
  border-radius: 2rem;
  margin-top: 40vh;
  padding: 1rem;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40%;
  margin-top: 2rem;
`;

const ButtonItem = styled.button<{ yes?: boolean }>`
  width: 4rem;
  border: none;
  border-bottom: 0.3rem solid ${props => (props.yes ? "#e88300" : "#2fb8fc")};
  padding: 0.1rem 1rem;
  text-align: center;
  font-size: 120%;
  background-color: #636363;
  color: #e8e8e8;
  border-radius: 0.25rem;
  transition: all 0.2s;

  :hover {
    color: #454940;
    background-color: #d6e0c9;
  }
`;

const AreYouSure: React.FC<Props> = props => {
  if (!props.showing) {
    return <React.Fragment />;
  }
  const title = props.title ? props.title : "Are You Sure?";
  const bText = props.bodyText
    ? props.bodyText
    : "Are you sure that you wish to continue?";
  return (
    <Outline>
      <Front>
        <h1>{title}</h1>
        <div>{bText}</div>
        <ButtonBox>
          <ButtonItem yes autoFocus onClick={() => props.onSelect(true)}>
            Yes
          </ButtonItem>
          <ButtonItem onClick={() => props.onSelect(false)}>No</ButtonItem>
        </ButtonBox>
      </Front>
    </Outline>
  );
};

export default AreYouSure;
