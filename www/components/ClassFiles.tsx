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

const ListBody = styled.div``;

interface Props {
  class_id: string;
  unit_id: string;
  showUploader?: boolean;
}

const ClassFiles: React.FC<Props> = ({ class_id, unit_id, showUploader }) => {
  const { data, error, loading } = useQuery<
    ClassFilesQuery,
    ClassFilesQueryVariables
  >(
    gql`
      query ClassFilesQuery($class_id: ID!, $unit_id: ID!) {
        myClassRole(class_id: $class_id) {
          id
          role
          class {
            id
            name
            unit(unit_id: $unit_id) {
              id
              order
              name
              files {
                id
                order
                mimetype
                url
                file_name
                description
              }
            }
          }
        }
      }
    `,
    { variables: { class_id, unit_id } }
  );

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  const amAdmin =
    data.myClassRole.role === "ADMIN" || data.myClassRole.role === "PROFESSOR";

  const upload =
    amAdmin && showUploader ? (
      <ClassContentUpload class_id={class_id} unit_id={unit_id} />
    ) : (
      <span />
    );

  return (
    <div>
      <div>Class Files for {data.myClassRole.class.unit.name}</div>
      {upload}
      <ListBody>
        {data.myClassRole.class.unit.files.map(file => (
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
