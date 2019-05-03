import styled from "styled-components";

const Input = styled.input`
  border: none;
  border-bottom: 0.1rem solid #049b00;
  padding: 0.5rem;
  transition: background-color 0.5s ease;

  :focus {
    background-color: gainsboro;
  }
`;

export default Input;
