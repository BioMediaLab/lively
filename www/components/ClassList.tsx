import React, { FunctionComponent } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import ErrorMessage from "./ErrorMessage";
import { MY_CLASSES } from "./__generated__/MY_CLASSES";
import { classesRoute } from "../routes";
import styled from "styled-components";
import Link from "next/link";

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

const List = styled.div`
  width: 20rem;
  background-color: #e8e8e8;
`;

const ListItem = styled.div`
  height: 2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;

  :hover {
    background-color: #e0e0e0;
    box-shadow: 0 0.25rem 0.3rem #bababa;
  }

  :active {
    box-shadow: inset 0.25rem 0.25rem 0.5rem #bababa;
  }
`;

const InnerLink = styled.a`
  width: 100%;
  padding-left: 7rem;
  margin-top: 0.3rem;
  text-decoration: none;
`;

const ClassList: FunctionComponent = () => {
  const { data, loading, error } = useQuery<MY_CLASSES>(MY_CLASSES_QUERY);

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const ClassesLink = classesRoute.Link;
  //console.log(test);

  return (
    <List>
      {data.myClasses.map(cl => (
        <ListItem key={cl.id}>
          <ClassesLink path={`/classes/${cl.class.id}`}>
            <InnerLink>{cl.class.name}</InnerLink>
          </ClassesLink>
        </ListItem>
      ))}
    </List>
  );
};

export default ClassList;
