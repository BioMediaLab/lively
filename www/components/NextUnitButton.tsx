import React, { useCallback } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import { classUnits } from "../routes";
import { NextUnit, NextUnitVariables } from "./__generated__/NextUnit";
import styled from "styled-components";

const Body = styled.button`
  width: 100%;
  height: 100%;
  margin: 1rem;
`;

const NextUnitAST = gql`
  query NextUnit($cls: ID!, $order: Int!) {
    class(class_id: $cls) {
      id
      unitByOrder(order: $order) {
        id
        name
      }
    }
  }
`;

const NextUnitButton: React.FC<{ order: number; classId: string }> = ({
  order,
  classId,
  children
}) => {
  const { data, error, loading } = useQuery<NextUnit, NextUnitVariables>(
    NextUnitAST,
    {
      variables: {
        order,
        cls: classId
      },
      skip: order < 0
    }
  );
  const onSelect = useCallback(() => {
    if (data && data.class && data.class.unitByOrder) {
      const id = data.class.unitByOrder.id;
      classUnits.push(`/classes/${classId}/units/${id}`);
    }
  }, [data, error, loading]);

  return (
    <Body
      disabled={
        loading || error || !data || !data.class.unitByOrder ? true : false
      }
      onClick={onSelect}
    >
      {children}
    </Body>
  );
};

export default NextUnitButton;
