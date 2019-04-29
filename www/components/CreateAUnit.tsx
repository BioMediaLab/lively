import React, { useState, useCallback } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

import BigDialog from "./ui/BigDialog";

const unitCreationMutation = gql`
  mutation CreateUnitUI($name: String!, $desc: String, $class_id: ID!) {
    createClassUnit(class_id: $class_id, name: $name, description: $desc) {
      id
    }
  }
`;

interface Props {
  classId: string;
}

const CreateUnit: React.FC<Props> = ({ classId }) => {
  const [showing, setShowing] = useState(false);
  const [nameField, setNameField] = useState("");
  const [descField, setDescField] = useState("");

  const create = useMutation(unitCreationMutation);

  const reset = useCallback(() => {
    setNameField("");
    setDescField("");
  }, []);

  const doCancel = useCallback(() => {
    setShowing(false);
    reset();
  }, [setShowing]);

  const doSave = useCallback(() => {
    create({
      variables: {
        class_id: classId,
        name: nameField,
        desc: descField
      }
    });
    doCancel();
  }, [doCancel, classId, nameField, descField]);

  return (
    <>
      <button onClick={() => setShowing(true)}>Create</button>
      <BigDialog showing={showing} title="Create a new unit">
        <label>
          Unit Name
          <input
            onChange={e => setNameField(e.target.value)}
            value={nameField}
          />
        </label>
        <label>
          Unit Description
          <input
            onChange={e => setDescField(e.target.value)}
            value={descField}
          />
        </label>
        <div>
          <button onClick={doSave}>Save</button>
          <button onClick={doCancel}>Cancel</button>
        </div>
      </BigDialog>
    </>
  );
};

export default CreateUnit;
