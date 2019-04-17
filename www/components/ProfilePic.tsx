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
  email: string;
  photo: string;
}

const ProfilePic = ({ user }: { user: User }) => {
  const mutate = useMutation<UpdateProfilePic, UpdateProfilePicVariables>(gql`
    mutation UpdateProfilePic($file: FileUpload!) {
      updateProfilePic(pic: $file) {
        id
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
      src="https://en.meming.world/images/en/thumb/2/2b/Unsettled_Tom.jpg/300px-Unsettled_Tom.jpg"
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
