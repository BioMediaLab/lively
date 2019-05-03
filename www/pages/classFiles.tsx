import React, { useState, useEffect } from "react";
import { NextFC } from "next";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { MdEdit } from "react-icons/md";

import makePage from "../lib/makePage";
import { classesRoute, classUnits } from "../routes";
import ErrorMessage from "../components/ErrorMessage";
import FileViewer from "../components/FileViewer";
import SmallInput from "../components/ui/SmallInput";
import { ClassFileQ, ClassFileQVariables } from "./__generated__/ClassFileQ";
import {
  UpdateFileFromPage,
  UpdateFileFromPageVariables
} from "./__generated__/UpdateFileFromPage";
import IconButton from "../components/ui/IconButton";

const EditingTopBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  width: 25%;
`;

interface Props {
  classId: string | null;
  fileId: string | null;
}

interface State {
  isEditing: boolean;
  nameField: string;
  descField: string;
}

const ClassFiles: NextFC<Props> = props => {
  if (!props.classId || !props.fileId) {
    return <ErrorMessage message="Class or file not found" />;
  }
  const { data, error, loading } = useQuery<ClassFileQ, ClassFileQVariables>(
    gql`
      query ClassFileQ($file_id: ID!) {
        classFile(file_id: $file_id) {
          id
          file_name
          description
          url
          unit {
            id
            name
          }
          class {
            id
            name
            myRole {
              id
              role
            }
          }
        }
      }
    `,
    { variables: { file_id: props.fileId } }
  );

  const [state, setState] = useState<State>({
    isEditing: false,
    nameField: "",
    descField: ""
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setState(st => ({
        ...st,
        nameField: data.classFile.file_name,
        descField: data.classFile.description ? data.classFile.description : ""
      }));
    }
  }, [data, error, loading]);

  const updateFile = useMutation<
    UpdateFileFromPage,
    UpdateFileFromPageVariables
  >(
    gql`
      mutation UpdateFileFromPage($file: ID!, $name: String!, $desc: String) {
        updateClassFile(file_id: $file, name: $name, description: $desc) {
          id
          file_name
          description
        }
      }
    `,
    {
      variables: {
        file: props.fileId,
        name: state.nameField,
        desc: state.descField
      }
    }
  );

  if (loading) {
    return <div>loading</div>;
  }
  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  const myRole = data.classFile.class.myRole.role;
  let topSection;
  if (state.isEditing) {
    topSection = (
      <EditingTopBody>
        <label htmlFor="File Name">File Name</label>
        <SmallInput
          name="File Name"
          value={state.nameField}
          minLength={1}
          autoFocus
          onChange={e => {
            const nameField = e.target.value;
            setState(state => ({ ...state, nameField }));
          }}
        />
        <label htmlFor="File Description">File Description</label>
        <input
          name="File Description"
          value={state.descField}
          onChange={e => {
            const descField = e.target.value;
            setState(state => ({ ...state, descField }));
          }}
        />
        <div>
          <button
            onClick={() => {
              updateFile();
              setState(state => ({ ...state, isEditing: false }));
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setState(state => ({
                ...state,
                isEditing: false,
                nameField: data.classFile.file_name,
                descField: data.classFile.description
                  ? data.classFile.description
                  : ""
              }));
            }}
          >
            Cancel
          </button>
        </div>
      </EditingTopBody>
    );
  } else {
    topSection = (
      <div style={{ display: "flex" }}>
        {myRole === "ADMIN" || myRole === "PROFESSOR" ? (
          <div>
            <IconButton
              onClick={() => setState(state => ({ ...state, isEditing: true }))}
            >
              <MdEdit />
            </IconButton>
          </div>
        ) : (
          <span />
        )}
        <div>
          <div>
            <classesRoute.Link path={`/classes/${props.classId}`}>
              {data.classFile.class.name}
            </classesRoute.Link>
            {" > "}
            <classUnits.Link
              path={`/classes/${props.classId}/units/${data.classFile.unit.id}`}
            >
              {data.classFile.unit.name}
            </classUnits.Link>
            {" > "}
            {state.nameField}
          </div>
          <small>{data.classFile.description}</small>
        </div>
      </div>
    );
  }

  return (
    <div>
      {topSection}
      <FileViewer url={data.classFile.url} name={data.classFile.file_name} />
    </div>
  );
};

ClassFiles.getInitialProps = ctx => {
  let { class_id, file_id } = ctx.query as any;
  if (!(typeof class_id === "string")) {
    class_id = null;
  }
  if (!(typeof file_id === "string")) {
    file_id = null;
  }
  return {
    classId: class_id,
    fileId: file_id
  };
};

export default makePage(ClassFiles);
