import React from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import {
  ClassFilesQuery,
  ClassFilesQueryVariables
} from "./__generated__/ClassFilesQuery";
import ClassContentUpload from "./ClassContentUpload";

interface FLIProps {
  name: string;
  url: string;
  id: string;
}

const FileListItem: React.FC<FLIProps> = props => {
  return (
    <div>
      {props.name}
      <a target="_blank" href={props.url}>
        View
      </a>
    </div>
  );
};

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
            files {
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
  const role = data.myClassRole.role;
  const upload =
    role === "ADMIN" || role == "PROFESSOR" ? (
      <ClassContentUpload class_id={class_id} />
    ) : (
      <span />
    );

  return (
    <div>
      Class Files for {data.myClassRole.class.name} {upload}
      {data.myClassRole.class.files.map(file => (
        <FileListItem
          key={file.id}
          name={file.file_name}
          url={file.url}
          id={file.id}
        />
      ))}
    </div>
  );
};

export default ClassFiles;
