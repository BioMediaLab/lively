import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import {
  UploadClassFilesMute,
  UploadClassFilesMuteVariables
} from "./__generated__/UploadClassFilesMute";

const uploadFile = gql`
  mutation UploadClassFilesMute($file: FileUpload!, $class: ID!) {
    uploadClassFile(file: $file, class_id: $class) {
      id
      url
      file_key
      file_name
      mimetype
    }
  }
`;

interface Props {
  class_id: string;
}

const ClassContextUpload: React.FC<Props> = ({ class_id }) => {
  const mutate = useMutation<
    UploadClassFilesMute,
    UploadClassFilesMuteVariables
  >(uploadFile);
  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length > 1) {
        throw new Error("attempting to upload more than 1 file at a time.");
      }
      mutate({
        variables: { file: { file: acceptedFiles[0] }, class: class_id }
      });
      // Do something with the files
    },
    [mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ClassContextUpload;
