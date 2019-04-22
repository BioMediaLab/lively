import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import {
  UploadClassFilesMute,
  UploadClassFilesMuteVariables
} from "./__generated__/UploadClassFilesMute";
import styled from "styled-components";
import { testClassFiles } from "../queries/__generated__/testClassFiles";
import { classFilesFragment } from "../queries/classFiles";

const uploadFile = gql`
  mutation UploadClassFilesMute(
    $file: FileUpload!
    $class: ID!
    $desc: String
  ) {
    uploadClassFile(file: $file, class_id: $class, description: $desc) {
      id
      url
      file_name
      mimetype
      description
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

const Input = styled.input`
  border: none;
  border-bottom: 0.1rem solid #049b00;
  padding: 0.5rem;
  transition: background-color 0.5s ease;

  :focus {
    background-color: gainsboro;
  }
`;

interface Props {
  class_id: string;
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

const ClassContextUpload: React.FC<Props> = ({ class_id }) => {
  const mutate = useMutation<
    UploadClassFilesMute,
    UploadClassFilesMuteVariables
  >(uploadFile, {
    update: (proxy, result) => {
      const oldData = proxy.readFragment<testClassFiles>({
        id: `Class:${class_id}`,
        fragment: classFilesFragment
      });

      if (oldData && result.data) {
        oldData.files.push(result.data.uploadClassFile);

        proxy.writeFragment({
          id: `Class:${class_id}`,
          fragment: classFilesFragment,
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
    mutate({
      variables: {
        file: { file: state.curFile, name: state.nameField },
        class: class_id,
        desc: state.descField.length > 2 ? state.descField : null
      }
    });
    updateState(initialState);
  }, [mutate, updateState, state.curFile, state.nameField]);

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
        <button
          disabled={!(state.curFile && state.nameField.length > 1)}
          onClick={onSubmit}
        >
          Upload
        </button>
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
