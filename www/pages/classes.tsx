import React from "react";
import { NextFunctionComponent } from "next";
import gql from "graphql-tag";
import makePage from "../lib/makePage";
import { useQuery } from "react-apollo-hooks";
import ErrorMessage from "../components/ErrorMessage";
import { GET_CLASS } from "./__generated__/GET_CLASS";

const GET_CLASS_QUERY = gql`
  query GET_CLASS($classId: ID!) {
    class(class_id: $classId) {
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
  const { data, error, loading } = useQuery<GET_CLASS>(GET_CLASS_QUERY, {
    variables: { classId: props.classId }
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  const curClass = data.class;
  return <div>{curClass.name}</div>;
};

Classes.getInitialProps = ctx => {
  if (typeof ctx.query.course_id === "string") {
    return { classId: ctx.query.course_id };
  }
  return { classId: false };
};

export default makePage(Classes);
