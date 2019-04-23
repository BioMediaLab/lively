import React from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import {
  ClassFilesQuery,
  ClassFilesQueryVariables
} from "./__generated__/ClassFilesQuery";
import ClassContentUpload from "./ClassContentUpload";
import FileListItem from "./FileListItem";
import styled from "styled-components";

const ListBody = styled.div`
  width: 80%;
`;

interface Props {
  class_id: string;
}

const ClassFiles: React.FC<Props> = ({ class_id }) => {
  const { data, error, loading } = useQuery<
    ClassFilesQuery,
    ClassFilesQueryVariables
  >(
    gql`
      query ClassFilesQuery($class_id: ID!) {
        myClassRole(class_id: $class_id) {
          id
          role
          class {
            id
            name
            files(max: 1000) {
              id
              mimetype
              url
              file_name
              description
            }
          }
        }
      }
    `,
    { variables: { class_id } }
  );

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  const amAdmin =
    data.myClassRole.role === "ADMIN" || data.myClassRole.role === "PROFESSOR";

  const upload = amAdmin ? (
    <ClassContentUpload class_id={class_id} />
  ) : (
    <span />
  );

  return (
    <div>
      <h4>Class Files for {data.myClassRole.class.name}</h4>
      {upload}
      <ListBody>
        {data.myClassRole.class.files.map(file => (
          <FileListItem
            key={file.id}
            name={file.file_name}
            url={file.url}
            id={file.id}
            admin={amAdmin}
            classId={class_id}
          />
        ))}
      </ListBody>
    </div>
  );
};

export default ClassFiles;
