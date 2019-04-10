import React from "react";
import { NextFunctionComponent } from "next";
import gql from "graphql-tag";
import makePage from "../lib/makePage";
import { useQuery } from "react-apollo-hooks";

const GET_CLASS = gql`
  query($classId: ID!) {
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
  const { data, error, loading } = useQuery(GET_CLASS, {
    variables: { classId: props.classId }
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>We could not find your class</div>;
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
