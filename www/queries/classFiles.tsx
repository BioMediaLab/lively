import gql from "graphql-tag";

export const classFilesFragment = gql`
  fragment testClassFiles on Class {
    files(max: 1000) {
      id
      file_name
      description
      url
      mimetype
    }
  }
`;
