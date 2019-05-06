import styled from "styled-components";

const ControlsButton = styled.button`
  border: 0.1rem solid ${p => p.theme.colors.main.secondary};
  border-radius: 0.5rem;
  background-color: #00000010;
  padding: 0.2rem 1rem;
  margin-top: 0.2rem;
  cursor: pointer;

  :hover {
    border: 0.1rem solid ${p => p.theme.colors.main.accent};
    background-color: #00000030;
  }

  :focus {
    border: 0.1rem solid ${p => p.theme.colors.main.accent};
    background-color: #00000030;
  }
`;

export default ControlsButton;
