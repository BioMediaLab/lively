import styled from "styled-components";

const IconButton = styled.button<{}>`
  border: none;
  padding: 0.2rem;
  font-size: 120%;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: #00000010;
  border: 0.1rem solid ${props => props.theme.colors.main.secondary};

  :hover {
    border-color: ${p => p.theme.colors.main.accent};
    background-color: #00000030;
  }
  :active {
    border-color: ${p => p.theme.colors.main.accent};
    background-color: #00000030;
  }
`;

export default IconButton;
