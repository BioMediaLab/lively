import styled from "styled-components";

const ControlsButton = styled.button`
  border: 0.1rem solid #3ab037;
  border-radius: 0.5rem;
  background-color: white;
  padding: 0.2rem 1rem;
  margin-top: 0.2rem;
  cursor: pointer;

  :hover {
    border: 0.1rem solid #ffcc6f;
    background-color: #d3d3d3;
  }

  :focus {
    border: 0.1rem solid #ffcc6f;
    background-color: #d3d3d3;
  }
`;

export default ControlsButton;
