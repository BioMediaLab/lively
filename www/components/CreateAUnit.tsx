import React, { useState, useCallback } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

import BigDialog from "./ui/BigDialog";
import ControlsButton from "./ui/ControlsButton";
import {
  CreateUnitUI,
  CreateUnitUIVariables
} from "./__generated__/CreateUnitUI";
import { ClassUnitsF } from "./__generated__/ClassUnitsF";

const unitCreationMutation = gql`
  mutation CreateUnitUI($name: String!, $desc: String, $class_id: ID!) {
    createClassUnit(class_id: $class_id, name: $name, description: $desc) {
      id
      name
      description
    }
  }
`;

const classUnitFragment = gql`
  fragment ClassUnitsF on Class {
    units {
      id
      name
      description
      files {
        id
        file_name
      }
    }
  }
`;

interface Props {
  classId: string;
  onCreate?: (name: string, desc: string | null) => void;
}

const CreateUnit: React.FC<Props> = ({ classId, ...props }) => {
  const [showing, setShowing] = useState(false);
  const [nameField, setNameField] = useState("");
  const [descField, setDescField] = useState("");

  const create = useMutation<CreateUnitUI, CreateUnitUIVariables>(
    unitCreationMutation,
    {
      update: (proxy, result) => {
        if (!result.data) {
          return;
        }
        const fid = `Class:${classId}`;
        const res = result.data.createClassUnit;
        const cache = proxy.readFragment<ClassUnitsF>({
          id: fid,
          fragment: classUnitFragment
        });
        if (!cache) {
          return;
        }
        cache.units.push({
          id: res.id,
          name: res.name,
          description: res.description,
          files: [],
          __typename: "ClassUnit"
        });
        proxy.writeFragment({
          id: fid,
          data: cache,
          fragment: classUnitFragment
        });
      }
    }
  );

  const doCancel = useCallback(() => {
    setShowing(false);
    setNameField("");
    setDescField("");
  }, [setShowing]);

  const doSave = useCallback(() => {
    create({
      variables: {
        class_id: classId,
        name: nameField,
        desc: descField
      }
    }).then(({ data }) => {
      if (props.onCreate && data) {
        props.onCreate(
          data.createClassUnit.name,
          data.createClassUnit.description
        );
      }
    });
    doCancel();
  }, [doCancel, classId, nameField, descField]);

  return (
    <>
      <ControlsButton onClick={() => setShowing(true)}>Create</ControlsButton>
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
