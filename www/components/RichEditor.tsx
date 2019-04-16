import React, { useState } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import NoSSR from "./NoSSR";

type GetState = () => ContentState;

interface Props {
  extractState?: (getState: GetState) => void;
}

const RichEditor: React.FC<Props> = ({ extractState }) => {
  const [editorState, updateEditorState] = useState(EditorState.createEmpty());

  const getState = () => editorState.getCurrentContent();
  if (extractState) {
    extractState(getState);
  }

  return (
    <NoSSR>
      <Editor
        editorState={editorState}
        onChange={newState => updateEditorState(newState)}
      />
    </NoSSR>
  );
};

export default RichEditor;
