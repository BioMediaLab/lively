import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import { Editor, EditorState } from "draft-js";
import styled from "styled-components";
import { stateToHTML } from "draft-js-export-html";
import { Text, Button } from "rebass";
import Input from "./Input";
import Form from "./Form";
import InputField from "./InputField";
import { GET_QUIZZES_QUERY } from "../pages/quizzes";

const CREATE_QUIZ_MUTATION = gql`
  mutation createQuiz($class_id: ID!, $title: String!) {
    createQuiz(class_id: $class_id, title: $title) {
      id
      class_id
      title
    }
  }
`;

const EditorWrapper = styled.div`
  height: 200px;
  border: 1px solid #f8f8f8;
`;

const CreateQuiz: FunctionComponent = ({ updateCache }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  useEffect(() => {
    focusEditor();
  }, []);

  const quiz = useMutation(CREATE_QUIZ_MUTATION, {
    update: updateCache
  });

  return (
    <div>
      <EditorWrapper>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
        />
      </EditorWrapper>
      <pre>{stateToHTML(editorState.getCurrentContent())}</pre>

      <Form
        initialValues={{ title: "" }}
        onSubmit={async values => {
          // const result = await fetch('my-api/authenticate')
          // do whatever you'd like to
          // return result
          // and SUCCESS 🎉
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

        <Button type="submit" primary>
          Create
        </Button>
      </Form>
    </div>
  );
};

export default CreateQuiz;
