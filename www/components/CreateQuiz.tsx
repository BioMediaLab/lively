import React, { FunctionComponent } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

const CREATE_QUIZ_MUTATION = gql`
  mutation createQuiz($class_id: ID!, $title: String!) {
    createQuiz(class_id: $class_id, title: $title) {
      id
      class_id
      title
    }
  }
`;

const CreateQuiz: FunctionComponent = () => {
  const quiz = useMutation(CREATE_QUIZ_MUTATION, {
    variables: {
      class_id: 2,
      title: "wooo hooo"
    }
  });
  return <div>CreateQuiz</div>;
};

export default CreateQuiz;
