import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";

import {
  UploadClassFilesMute,
  UploadClassFilesMuteVariables
} from "./__generated__/UploadClassFilesMute";
import Input from "./ui/SmallInput";
import ControlsButton from "./ui/ControlsButton";
import { SingleUnitFiles } from "./__generated__/SingleUnitFiles";

const uploadFile = gql`
  mutation UploadClassFilesMute(
    $file: FileUpload!
    $class: ID!
    $desc: String
    $unit: ID!
  ) {
    uploadClassFile(
      file: $file
      class_id: $class
      unit_id: $unit
      description: $desc
    ) {
      id
      url
      file_name
      mimetype
      description
      order
    }
  }
`;

const PatchFragment = gql`
  fragment SingleUnitFiles on ClassUnit {
    id
    files {
      id
      file_name
    }
  }
`;

const UploadUIBody = styled.div`
  width: 30rem;
  height: 15rem;
  padding: 0.5rem;
  display: flex;
  border: 0.1rem solid #049b00;
  border-radius: 0.5rem;
  margin: 1rem;
`;

const Upload = styled.div`
  width: 50%;
  border: 2rem solid #498fff;
  border-radius: 0.5rem;
  margin: 1rem;

  :hover {
    background-color: #e0e0e0;
    border-color: #2578fc;
  }
`;

const Fields = styled.div`
  width: 50%;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 3rem;
`;

interface Props {
  class_id: string;
  unit_id: string;
  onCancel?: () => void;
  onSubmit?: (name: string, desc: string) => void;
  onResult?: (error: boolean, data?: UploadClassFilesMute) => void;
}

interface State {
  nameField: string;
  descField: string;
  uploadBoxTitle: string;
  curFile?: any;
}

const initialState = {
  nameField: "",
  descField: "",
  uploadBoxTitle: ""
};

const ClassContextUpload: React.FC<Props> = ({
  class_id,
  unit_id,
  ...props
}) => {
  const mutate = useMutation<
    UploadClassFilesMute,
    UploadClassFilesMuteVariables
  >(uploadFile, {
    update: (proxy, result) => {
      const oldData = proxy.readFragment<SingleUnitFiles>({
        id: `ClassUnit:${unit_id}`,
        fragment: PatchFragment
      });

      if (oldData && result.data) {
        oldData.files.push(result.data.uploadClassFile);

        proxy.writeFragment({
          id: `ClassUnit:${unit_id}`,
          fragment: PatchFragment,
          data: oldData
        });
      }
    }
  });

  const [state, updateState] = useState<State>(initialState);

  const onDrop = useCallback(
    ([curFile, ...files]) => {
      if (files.length > 1) {
        throw new Error("attempting to upload more than 1 file at a time.");
      }
      updateState(oldState => ({
        ...oldState,
        curFile,
        nameField:
          oldState.nameField.length > 1 ? oldState.nameField : curFile.name,
        uploadBoxTitle: curFile.name
      }));
    },
    [updateState]
  );

  const onSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(state.nameField, state.descField);
    }
    mutate({
      variables: {
        file: { file: state.curFile, name: state.nameField },
        class: class_id,
        unit: unit_id,
        desc: state.descField.length > 2 ? state.descField : null
      }
    }).then(res => {
      if (props.onResult) {
        if (res.errors || !res.data) {
          props.onResult(true);
        } else {
          props.onResult(false, res.data);
        }
      }
    });
    updateState(initialState);
  }, [mutate, updateState, state.curFile, state.nameField]);

  const onCancel = useCallback(() => {
    updateState(initialState);
    if (props.onCancel) {
      props.onCancel();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  let uploadBoxMessage =
    "Drag a file here or click to select files from your storage.";
  if (!isDragActive) {
    uploadBoxMessage = "Click to choose a file from your storage.";
  }
  if (state.curFile) {
    uploadBoxMessage = state.uploadBoxTitle;
  }

  return (
    <UploadUIBody>
      <Fields>
        <h3>Upload a new file</h3>
        <Input
          type="text"
          placeholder="File Name"
          onChange={event => {
            const nameField = event.target.value;
            updateState(state => ({ ...state, nameField }));
          }}
          value={state.nameField}
        />
        <Input
          type="text"
          placeholder="File Description"
          onChange={event => {
            const descField = event.target.value;
            updateState(state => ({ ...state, descField }));
          }}
          value={state.descField}
        />
        <ControlsButton
          disabled={!(state.curFile && state.nameField.length > 1)}
          onClick={onSubmit}
        >
          Upload
        </ControlsButton>
        <ControlsButton onClick={onCancel}>Cancel</ControlsButton>
      </Fields>
      <Upload {...getRootProps()}>
        <input {...getInputProps()} />
        <p style={{ padding: "1rem", overflowWrap: "anywhere" }}>
          {uploadBoxMessage}
        </p>
      </Upload>
    </UploadUIBody>
  );
};

export default ClassContextUpload;
