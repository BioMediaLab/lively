import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import { Heading, Button } from "rebass";
import Form from "./Form";
import InputField from "./InputField";
import DraftjsField from "./DraftjsField";
import Draft, { EditorState } from "draft-js";
import CreateQuestions from "./CreateQuestions";

const CREATE_QUIZ_MUTATION = gql`
  mutation createQuiz($class_id: ID!, $title: String!) {
    createQuiz(class_id: $class_id, title: $title) {
      id
      class_id
      title
    }
  }
`;

const CreateQuiz: FunctionComponent = ({ updateCache }) => {
  const quiz = useMutation(CREATE_QUIZ_MUTATION, {
    update: updateCache
  });
  const [editorState] = React.useState(() =>
    EditorState.createWithContent(emptyContentState)
  );

  console.log("render");

  return (
    <div>
      <Heading>Create Quiz</Heading>

      <Form
        initialValues={{
          title: "",
          descriptionState: editorState,
          questions: [{ title: "Quiz 1" }]
        }}
        onSubmit={async values => {
          quiz({
            variables: {
              class_id: 2,
              title: values.title
            }
          });
        }}
      >
        <InputField
          name="title"
          label="title"
          placeholder="Enter A Title Here"
          css={{ width: "100%", padding: "10px", fontWeight: "bold" }}
          fontSize={4}
          mb={4}
        />

        <DraftjsField name="descriptionState" />

        <CreateQuestions />

        <Button type="submit" primary>
          Create
        </Button>
      </Form>
    </div>
  );
};

const emptyContentState = Draft.convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: []
    }
  ]
});

export default CreateQuiz;
