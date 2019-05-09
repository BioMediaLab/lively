import styled from "styled-components";

const BorderlessButton = styled.button`
  border: none;
  background-color: ${p => p.theme.colors.main.primary};
  padding: 0.2rem 1rem;
  cursor: pointer;

  :hover {
    background-color: #f0f0f0;
  }

  :focus {
    background-color: ${p => p.theme.colors.main.secondary};
  }
`;

export default BorderlessButton;
