import React, { FunctionComponent } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import ErrorMessage from "./ErrorMessage";
import { MY_CLASSES } from "./__generated__/MY_CLASSES";
import { classesRoute } from "../routes";

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

  const Link = classesRoute.Link;
  //console.log(test);

  return (
    <div>
      {data.myClasses.map(cl => (
        <Link path={`/classes/${cl.class.id}`} prefetch={false}>
          <a>{cl.class.name}</a>
        </Link>
      ))}
    </div>
  );
};

export default ClassList;
