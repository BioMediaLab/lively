import React from "react";
import Dropzone from "react-dropzone";
import { useMutation } from "react-apollo-hooks";
import { Image } from "rebass";
import gql from "graphql-tag";
import {
  UpdateProfilePic,
  UpdateProfilePicVariables
} from "./__generated__/UpdateProfilePic";

interface User {
  id: string;
  name: string;
  photo: string;
}

const ProfilePic = ({ user }: { user: User }) => {
  const mutate = useMutation<UpdateProfilePic, UpdateProfilePicVariables>(gql`
    mutation UpdateProfilePic($file: FileUpload!) {
      updateProfilePic(pic: $file) {
        id
        photo
      }
    }
  `);

  const avatar = user.photo ? (
    <Image
      style={{
        borderRadius: 60,
        width: 100,
        height: 100
      }}
      src={user.photo}
    />
  ) : (
    <p
      style={{
        color: "white",
        fontSize: 32,
        fontFamily: "sans-serif"
      }}
    >
      .
    </p>
  );

  return (
    <>
      <Dropzone
        accept="image/*"
        multiple={false}
        onDrop={files => {
          mutate({ variables: { file: { file: files[0] } } });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              borderRadius: 60,
              width: 100,
              height: 100,
              background: "silver",
              border: "1px solid lightgrey",
              textAlign: "center"
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {avatar}
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default ProfilePic;
