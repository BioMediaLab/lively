import React, { useState, useCallback } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import styled from "styled-components";
import AreYouSure from "./ui/AreYouSure";
import { DeleteFileMute } from "./__generated__/DeleteFileMute";
import { testClassFiles } from "../queries/__generated__/testClassFiles";
import { classFilesFragment } from "../queries/classFiles";
import { classFiles } from "../routes";
import ControlsButton from "./ui/ControlsButton";

interface FLIProps {
  name: string;
  url: string;
  id: string;
  classId: string;
  admin?: boolean;
  showLink?: boolean;
}

const defaultProps = {
  admin: false
};

type DefaultProps = Readonly<typeof defaultProps>;

const FileListItemBody = styled.div`
  min-height: 3rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.1rem solid #498fff;
  padding-left: 1rem;
  font-size: 120%;
`;

const FileListAction = styled.div`
  padding-left: 0.25rem;
`;

const FileListItem: React.FC<FLIProps & Partial<DefaultProps>> = props => {
  const [showingConfirm, setShowConf] = useState(false);
  const deleteFile = useMutation<DeleteFileMute>(
    gql`
      mutation DeleteFileMute($id: ID!) {
        deleteClassFile(file_id: $id) {
          id
        }
      }
    `,
    {
      variables: { id: props.id },
      update: (proxy, result) => {
        if (result && result.data) {
          const fileId = result.data.deleteClassFile.id;
          const oldData = proxy.readFragment<testClassFiles>({
            id: `Class:${props.classId}`,
            fragment: classFilesFragment
          });

          if (oldData) {
            oldData.files = oldData.files.filter(({ id }) => id !== fileId);

            proxy.writeFragment({
              id: `Class:${props.classId}`,
              fragment: classFilesFragment,
              data: oldData
            });
          }
        }
      }
    }
  );

  const opener = useCallback(
    event => {
      event.preventDefault();
      window.open(props.url);
    },
    [props.url]
  );

  const deleter = useCallback(
    res => {
      setShowConf(false);
      if (res) {
        deleteFile();
      }
    },
    [deleteFile]
  );

  return (
    <>
      <FileListItemBody>
        <classFiles.Link path={`/classes/${props.classId}/files/${props.id}`}>
          {props.name}
        </classFiles.Link>
        <div style={{ display: "flex" }}>
          <FileListAction>
            <ControlsButton onClick={opener}>Download</ControlsButton>
          </FileListAction>
          <FileListAction>
            {props.admin ? (
              <ControlsButton onClick={() => setShowConf(true)}>
                Delete
              </ControlsButton>
            ) : (
              <span />
            )}
          </FileListAction>
        </div>
      </FileListItemBody>
      <AreYouSure
        bodyText={`Are you sure that you want to delete "${
          props.name
        }". This can not be undone.`}
        showing={showingConfirm}
        onSelect={deleter}
      />
    </>
  );
};

FileListItem.defaultProps = defaultProps;

export default FileListItem;
