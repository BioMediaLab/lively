import React from "react";
import Dropzone from "react-dropzone";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import {
  UpdateProfilePic,
  UpdateProfilePicVariables
} from "./__generated__/UpdateProfilePic";

const ProfilePic = () => {
  const mutate = useMutation<UpdateProfilePic, UpdateProfilePicVariables>(gql`
    mutation UpdateProfilePic($file: FileUpload!) {
      updateProfilePic(pic: $file) {
        id
      }
    }
  `);

  return (
    <Dropzone
      accept="image/*"
      multiple={false}
      onDrop={files => {
        console.log(files[0]);
        mutate({ variables: { file: { file: files[0] } } });
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          style={{
            borderRadius: 60,
            width: 100,
            height: 100,
            background: "yellow",
            border: "3px solid red",
            textAlign: "center"
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p style={{ marginTop: 72 }}>Change</p>
        </div>
      )}
    </Dropzone>
  );
};

export default ProfilePic;
