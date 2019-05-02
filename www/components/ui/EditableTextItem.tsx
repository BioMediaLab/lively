import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { IoIosThumbsDown, IoIosThumbsUp } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import IconButton from "./IconButton";

const EditBody = styled.div`
  display: flex;
  align-items: center;
`;

const Controls = styled.div<{ editing: boolean }>`
  width: ${props => (props.editing ? "4rem" : "2rem")};
  padding-right: ${props => (props.editing ? "0" : "1rem")};
`;

interface Props {
  bodyText: string;
  onUpdate?: (newText: string) => void;
  onCancel?: () => void;
  enabled?: boolean;
}

const EditableTextItem: React.FC<Props> = props => {
  const [isEditing, setEditing] = useState(false);
  const [field, setField] = useState(props.bodyText);

  const startEdit = useCallback(() => {
    setEditing(true);
  }, []);
  const cancelEdit = useCallback(() => {
    setField(props.bodyText);
    setEditing(false);
    if (props.onCancel) {
      props.onCancel();
    }
  }, []);
  const saveEdit = useCallback(() => {
    setEditing(false);
    if (props.onUpdate) {
      props.onUpdate(field);
    }
  }, [field]);

  useEffect(() => {
    if (field !== props.bodyText) {
      setField(props.bodyText);
    }
  }, [props.bodyText]);

  if (isEditing) {
    return (
      <EditBody>
        <Controls editing>
          <IconButton onClick={saveEdit}>
            <IoIosThumbsUp />
          </IconButton>
          <IconButton onClick={cancelEdit}>
            <IoIosThumbsDown />
          </IconButton>
        </Controls>
        <input
          value={field}
          onChange={e => {
            const newText = e.target.value;
            setField(newText);
          }}
        />
      </EditBody>
    );
  }
  return (
    <EditBody>
      <Controls editing={false}>
        <IconButton onClick={startEdit}>
          <MdEdit />
        </IconButton>
      </Controls>
      {field}
    </EditBody>
  );
};

export default EditableTextItem;
