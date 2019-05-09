import styled from "styled-components";

const BorderlessIconButton = styled.button`
  border: none;
  font-size: 120%;
  height: 2rem;
  background-color: ${p => p.theme.colors.main.primary};
  cursor: pointer;

  :hover {
    background-color: ${p => p.theme.colors.main.primary};
  }
  :active {
    border-color: ${p => p.theme.colors.main.accent};
    background-color: #00000030;
  }
`;

export default BorderlessIconButton;
