import { useCallback } from "react";
import { NextFunctionComponent } from "next";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { MdHome } from "react-icons/md";

import makePage from "../lib/makePage";
import { classUnits, classesRoute } from "../routes";
import ErrorMessage from "../components/ErrorMessage";
import ClassUnitList from "../components/ClassUnitList";
import ClassFiles from "../components/ClassFiles";
import { FullUnit, FullUnitVariables } from "./__generated__/FullUnit";
import NextUnitButton from "../components/NextUnitButton";

const UnitQueryAST = gql`
  query FullUnit($cls: ID!, $unit: ID!) {
    class(class_id: $cls) {
      id
      unit(unit_id: $unit) {
        id
        name
        description
        order
      }
    }
  }
`;

const UnitViewBody = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-row-gap: 2rem;
  height: 90vh;
`;

const PrevUnitChange = styled.div`
  grid-column: 1/5;
  grid-row: 1;
`;

const NextUnitChange = styled.div`
  grid-column: 8/12;
  grid-row: 1;
`;

const CourseHome = styled.div`
  grid-column: 6/8;
  grid-row: 1;
`;

const LeftInfo = styled.div`
  grid-column: 1/4;
  grid-row: 2/13;
  background-color: ${p => p.theme.colors.background.secondary};
  padding-left: 2rem;
`;

const MainContext = styled.div`
  grid-column: 4/13;
  grid-row: 2/13;
  padding-left: 2rem;
`;

interface Props {
  classId: string | null;
  unitId: string | null;
}

const Index: NextFunctionComponent<Props> = props => {
  if (!props.classId) {
    return <ErrorMessage message="Unit not found" />;
  }

  const onUnitSelect = useCallback(unitId => {
    classUnits.push(`/classes/${props.classId}/units/${unitId}`);
  }, []);

  if (!props.unitId) {
    return (
      <div>
        <ClassUnitList onUnitSelect={onUnitSelect} classId={props.classId} />
      </div>
    );
  }

  const { data, error, loading } = useQuery<FullUnit, FullUnitVariables>(
    UnitQueryAST,
    {
      variables: {
        cls: props.classId,
        unit: props.unitId
      }
    }
  );
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <UnitViewBody>
      <PrevUnitChange>
        <NextUnitButton
          classId={props.classId}
          order={
            typeof data.class.unit.order === "number"
              ? data.class.unit.order - 1
              : -1
          }
        >
          Previous
        </NextUnitButton>
      </PrevUnitChange>
      <CourseHome>
        <classesRoute.Link path={`/classes/${props.classId}`}>
          <a>
            <div>
              <MdHome /> Class Home
            </div>
          </a>
        </classesRoute.Link>
      </CourseHome>
      <NextUnitChange>
        <NextUnitButton
          classId={props.classId}
          order={
            typeof data.class.unit.order === "number"
              ? data.class.unit.order + 1
              : -1
          }
        >
          Next
        </NextUnitButton>
      </NextUnitChange>
      <LeftInfo>
        <h2>{data.class.unit.name}</h2>
        <p>{data.class.unit.description}</p>
      </LeftInfo>
      <MainContext>
        <ClassFiles
          unit_id={props.unitId}
          class_id={props.classId}
          showUploader
        />
      </MainContext>
    </UnitViewBody>
  );
};

Index.getInitialProps = ctx => {
  let classId = null;
  let unitId = null;
  if (typeof ctx.query.class_id === "string") {
    classId = ctx.query.class_id;
  }
  if (typeof ctx.query.unit_id === "string") {
    unitId = ctx.query.unit_id;
  }
  return {
    classId,
    unitId
  };
};

export default makePage(Index);
