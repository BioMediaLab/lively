import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { editUnits } from "../routes";
import ErrorMessage from "./ErrorMessage";
import { ClassUnits, ClassUnitsVariables } from "./__generated__/ClassUnits";
import styled from "styled-components";
import ClassFiles from "./ClassFiles";

const getClassUnits = gql`
  query ClassUnits($class_id: ID!, $dep: Boolean!) {
    class(class_id: $class_id) {
      id
      myRole {
        id
        role
      }
      units(deployed: $dep) {
        id
        name
        order
        description
      }
    }
  }
`;

const Body = styled.div`
  border-left: 1rem solid green;
  height: 100%;
  min-width: 50rem;
  margin: -2rem;
  padding-top: 2rem;
`;

const Title = styled.div`
  display: flex;
  padding: 0 0 1rem 2rem;
  width: 100%;
  justify-content: space-between;
`;

const ListItem = styled.div`
  margin-bottom: 1rem;
`;

const ListItemTop = styled.div`
  border: 0.2px solid green;
  border-radius: 0 1rem 1rem 0;
  display: flex;
  height: 4rem;
`;

const ListItemTitle = styled.div`
  padding-left: 2rem;
  padding-right: 1rem;
  width: 100%;
  border-radius: 0 1rem 1rem 0;
  :hover {
    background-color: magenta;
  }
`;

const ItemDropdownButton = styled.button`
  background-color: gray;
  border: none;
  width: 2rem;
  height: 100%;

  :hover {
    background-color: red;
  }

  :active {
    box-shadow: inset 0.25rem 0.25rem 0.5rem #bababa;
  }
`;

const ListBody = styled.div`
  margin-left: 4rem;
  border-left: 0.2rem solid green;
  border-bottom: 0.2rem solid green;
  border-bottom-left-radius: 1rem;
  padding-left: 1rem;
  padding-bottom: 1rem;
`;

interface Props {
  onUnitSelect: (unitId: string) => void;
  classId: string;
  showUndeployed?: boolean;
  showEdit?: boolean;
  onFileSelect?: (fileId: string, unitId: string) => void;
  startWithOpenUnit?: boolean;
}

const ClassUnitList: React.FC<Props> = props => {
  const [curUnit, setUnit] = useState<null | string>(null);
  const { data, error, loading } = useQuery<ClassUnits, ClassUnitsVariables>(
    getClassUnits,
    {
      variables: {
        dep: props.showUndeployed ? props.showUndeployed : false,
        class_id: props.classId
      }
    }
  );
  useEffect(() => {
    if (props.startWithOpenUnit && !loading && !error && data) {
      setUnit(data.class.units[0].id);
    }
  }, [loading, error, data]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  const role = data.class.myRole.role;
  const adminButton =
    props.showEdit && (role === "ADMIN" || role === "PROFESSOR") ? (
      <button
        onClick={() => {
          editUnits.push(`/classes/${props.classId}/edit`);
        }}
      >
        Edit
      </button>
    ) : (
      <span />
    );

  const unitNodes = data.class.units.map(({ id, name, description }) => (
    <ListItem key={id}>
      <ListItemTop>
        <ItemDropdownButton
          onClick={e => {
            e.preventDefault();
            if (curUnit === id) {
              setUnit(null);
            } else {
              setUnit(id);
            }
          }}
        />
        <ListItemTitle
          onClick={() => {
            props.onUnitSelect(id);
          }}
        >
          <div>{name}</div>
          <p>{description}</p>
        </ListItemTitle>
      </ListItemTop>
      {curUnit === id ? (
        <ListBody>
          <ClassFiles class_id={props.classId} unit_id={id} showUploader />
        </ListBody>
      ) : (
        <React.Fragment />
      )}
    </ListItem>
  ));
  return (
    <Body>
      <Title>
        <h4>Class Units</h4>
        {adminButton}
      </Title>
      {unitNodes}
    </Body>
  );
};

export default ClassUnitList;
