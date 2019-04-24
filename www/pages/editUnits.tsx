import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import ErrorMessage from "../components/ErrorMessage";
import CreateAUnit from "../components/CreateAUnit";

interface Props {
  classId: string | null;
}

const Index: NextFunctionComponent<Props> = props => {
  if (!props.classId) {
    return <ErrorMessage message="Class not found" />;
  }
  return (
    <div>
      Edit Unit <CreateAUnit classId={props.classId} />
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
