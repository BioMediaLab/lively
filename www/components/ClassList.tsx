import React, { FunctionComponent } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import ErrorMessage from "./ErrorMessage";
import { MY_CLASSES } from "./__generated__/MY_CLASSES";

const MY_CLASSES_QUERY = gql`
  query MY_CLASSES {
    myClasses {
      id
      role
      class {
        id
        name
      }
    }
  }
`;

const ClassList: FunctionComponent = () => {
  const { data, loading, error } = useQuery<MY_CLASSES>(MY_CLASSES_QUERY);

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.myClasses.map((cl: any) => (
        <div>{cl.class.name}</div>
      ))}
    </div>
  );
};

export default ClassList;
