import React, { useState, useRef, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import styled from "styled-components";
import { useField, useFormikContext } from "formik";

const EditorWrapper = styled.div`
  height: 200px;
  border: 1px solid #f8f8f8;
`;

const DraftjsField = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  const formik = useFormikContext();

  useEffect(() => {
    focusEditor();
  }, []);

  const editor = useRef(null);

  const focusEditor = () => {
    console.log("focus fool");
    editor.current.focus();
  };

  const handleOnChange = editorState => {
    formik.setFieldValue(name, editorState);
  };

  console.log("name", formik.values[name]);

  return (
    <EditorWrapper onClick={focusEditor}>
      <Editor
        editorKey="{`${name}Editor`}"
        ref={editor}
        editorState={formik.values[name]}
        onChange={handleOnChange}
      />
    </EditorWrapper>
  );
};

export default DraftjsField;
