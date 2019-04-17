import React from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import {
  ClassFilesQuery,
  ClassFilesQueryVariables
} from "./__generated__/ClassFilesQuery";
import ClassContentUpload from "./ClassContentUpload";

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
    </div>
  );
};

export default ClassFiles;
