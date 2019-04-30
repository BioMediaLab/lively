import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import ErrorMessage from "../components/ErrorMessage";
import CreateAUnit from "../components/CreateAUnit";
import UnitDDContext from "../components/unitEditing/UnitDDContext";
import { GetUnitsForEditing } from "./__generated__/GetUnitsForEditing";

interface Props {
  classId: string | null;
}

const Index: NextFunctionComponent<Props> = props => {
  if (!props.classId) {
    return <ErrorMessage message="Class not found" />;
  }
  const { data, error, loading } = useQuery<GetUnitsForEditing>(
    gql`
      query GetUnitsForEditing($cls: ID!) {
        class(class_id: $cls) {
          id
          units {
            id
            name
            description
            files {
              id
              file_name
            }
          }
        }
      }
    `,
    { variables: { cls: props.classId } }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <div>
      Edit Unit <CreateAUnit classId={props.classId} />
      <UnitDDContext initialUnits={data.class.units} />
    </div>
  );
};

Index.getInitialProps = ctx => {
  let classId = null;
  if (typeof ctx.query.class_id === "string") {
    classId = ctx.query.class_id;
  }
  return {
    classId
  };
};

export default makePage(Index);
