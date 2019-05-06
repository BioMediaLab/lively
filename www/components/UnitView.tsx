import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import ErrorMessage from "./ErrorMessage";
import { UnitInfo } from "./__generated__/UnitInfo";

const UNIT_INFO_AST = gql`
  query UnitInfo($unit: ID!, $class: ID!) {
    class(class_id: $class) {
      id
      unit(unit_id: $unit) {
        id
        name
        description
      }
    }
  }
`;

interface Props {
  classId: string;
  unitId: string;
}

const UnitView: React.FC<Props> = props => {
  const { error, loading, data } = useQuery<UnitInfo>(UNIT_INFO_AST, {
    variables: { unit: props.unitId, class: props.classId }
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <div>
      <div>{data.class.unit.name}</div>
      <div>{data.class.unit.description}</div>
    </div>
  );
};

export default UnitView;
