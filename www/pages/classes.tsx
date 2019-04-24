import React from "react";
import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import { useQuery } from "react-apollo-hooks";

import { classSettings, classUnits } from "../routes";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import { GET_CLASS, GET_CLASSVariables } from "./__generated__/GET_CLASS";
import styled from "styled-components";
import ClassUnitList from "../components/ClassUnitList";

const GET_CLASS_QUERY = gql`
  query GET_CLASS($classId: ID!) {
    class(class_id: $classId) {
      id
      name
      description
    }
  }
`;

const ClassMain = styled.div`
  display: flex;
`;

const ClassLeft = styled.div`
  background-color: #d3d3d3;
  width: 34%;
  min-height: 90vh;
  margin-left: -2rem;
  margin-top: -2rem;
  padding-left: 4rem;
  padding-top: 3rem;
`;

const ClassRight = styled.div`
  margin-left: 2rem;
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
    <ClassMain>
      <ClassLeft>
        <h2>{curClass.name}</h2>
        <p>{curClass.description}</p>
        <classSettings.Link path={`/classes/${props.classId}/settings`}>
          <a>Settings</a>
        </classSettings.Link>
      </ClassLeft>
      <ClassRight>
        <ClassUnitList
          classId={props.classId}
          showEdit
          onUnitSelect={unitId => {
            classUnits.push(`/classes/${props.classId}/units/${unitId}`);
          }}
        />
      </ClassRight>
    </ClassMain>
  );
};

Classes.getInitialProps = ctx => {
  if (typeof ctx.query.course_id === "string") {
    return { classId: ctx.query.course_id };
  }
  return { classId: false };
};

export default makePage(Classes);
