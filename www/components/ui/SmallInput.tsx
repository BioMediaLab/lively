import styled from "styled-components";

const Input = styled.input`
  border: none;
  border-bottom: 0.2rem solid ${props => props.theme.colors.main.primary};
  padding: 0.5rem;
  background-color: ${p => p.theme.colors.background.primary};
  transition: background-color 0.5s ease;

  :focus {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

export default Input;
