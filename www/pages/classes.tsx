import React from "react";
import { NextFunctionComponent } from "next";
import gql from "graphql-tag";
import makePage from "../lib/makePage";
import { useQuery } from "react-apollo-hooks";
import { Heading } from "rebass";
import ErrorMessage from "../components/ErrorMessage";
import { GET_CLASS, GET_CLASSVariables } from "./__generated__/GET_CLASS";
import { classSettings } from "../routes";
import ClassFiles from "../components/ClassFiles";

const GET_CLASS_QUERY = gql`
  query GET_CLASS($classId: ID!) {
    class(class_id: $classId) {
      id
      name
      description
    }
  }
`;

interface Props {
  classId: string | false;
}

const Classes: NextFunctionComponent<Props> = props => {
  if (!props.classId) {
    return <div>Class Not Found</div>;
  }
  const { data, error, loading } = useQuery<GET_CLASS, GET_CLASSVariables>(
    GET_CLASS_QUERY,
    {
      variables: { classId: props.classId }
    }
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  const curClass = data.class;
  return (
    <div>
      <Heading>{curClass.name}</Heading>
      <classSettings.Link path={`/classes/${props.classId}/settings`}>
        <a>Settings</a>
      </classSettings.Link>
      <ClassFiles class_id={props.classId} />
    </div>
  );
};

Classes.getInitialProps = ctx => {
  if (typeof ctx.query.course_id === "string") {
    return { classId: ctx.query.course_id };
  }
  return { classId: false };
};

export default makePage(Classes);
